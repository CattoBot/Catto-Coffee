import { Guild, CategoryChannel, VoiceState, ChannelType, PermissionFlagsBits, OverwriteResolvable } from 'discord.js';
import { Config } from '@app/config';
import { logger, ServerLogger } from '@logger';
import { Prisma, PrismaCoreModule } from '@lib/database/prisma';
import { seconds } from '@shared/functions/time.funct';
import { Redis, RedisCoreModule } from '@lib/database/redis';

export class VoiceCreateHelper {
    private readonly logger: ServerLogger;
    private readonly prisma: PrismaCoreModule;
    private readonly redis: RedisCoreModule

    constructor() {
        this.prisma = Prisma;
        this.logger = logger;
        this.redis = Redis;
    }

    public async initChannel(newState: VoiceState, oldState: VoiceState) {
        if (!newState.guild) return;
        try {
            const channels = await this.getChannel(newState.guild.id);
            for (const channel of channels) {
                await this.attemptChannelCreation(channel, newState, oldState);
            }
        } catch (error) {
            this.logger.error(`Error in initializing channels: ${error.message}`, { guildId: newState.guild.id });
        }
    }

    private async attemptChannelCreation(channelConfig, newState: VoiceState, oldState: VoiceState) {
        const { channel_id, parent_id } = channelConfig;
        const parent = newState.guild.channels.resolve(parent_id) as CategoryChannel;
        if (!parent) {
            this.logger.warn(`Parent category does not exist: ${parent_id}`, { guildId: newState.guild.id });
            return;
        }
        if (this.shouldCreateChannel(oldState, newState, channel_id)) {
            await this.createChannel(newState.guild, parent, newState.member.id, newState);
        }
    }

    private async createChannel(guild: Guild, parent: CategoryChannel, user_id: string, newState: VoiceState) {

        const user_cooldown = await this.getUserCooldown(user_id);
        if (user_cooldown && user_cooldown > Date.now()) {
            this.logger.info(`User ${user_id} is still on cooldown.`, { userId: user_id });
            return;
        }

        this.setUserCooldown(user_id);
        const channel_details = await this.setChannelDetails(user_id, parent, newState);
        const channel = await this.buildChannel(guild, channel_details.name, channel_details.userLimit, parent, channel_details.permissions);
        try {
            await newState.setChannel(channel);
        } catch (error) {
            this.logger.error(`Error while creating the channel for user ${user_id}: ${error}`, { userId: user_id });
            throw new Error(`Failed to create channel: ${error.message}`);
        }
        await this.storeChannelInDatabase(guild.id, channel.id, parent.id, user_id);
    }

    private async getChannel(guildId: string) {
        try {
            const data = await this.prisma.iVoices.findMany({
                where: {
                    guildId: guildId
                }
            });
            return data.map(({ channelId, categoryId }) => ({ channel_id: channelId, parent_id: categoryId }));
        } catch (error) {
            this.logger.error(`Failed to retrieve channels for guild ${guildId}: ${error}`, { guildId });
            return [];
        }
    }

    private async getUserCooldown(user_id: string): Promise<number | undefined> {
        try {
            const cooldown = await this.redis.get(`cooldown:${user_id}`);
            return cooldown ? parseInt(cooldown) : undefined;
        } catch (error) {
            this.logger.error(`Error retrieving cooldown for user ${user_id}: ${error}`, { userId: user_id });
            return undefined;
        }
    }

    private setUserCooldown(user_id: string) {
        const cooldownPeriod = seconds(Config.Modules.Voice.CreateChannelCooldown);
        try {
            this.redis.set(`cooldown:${user_id}`, Date.now() + cooldownPeriod, 'PX', cooldownPeriod);
        } catch (error) {
            this.logger.error(`Error setting cooldown for user ${user_id}: ${error}`, { userId: user_id });
        }

    }

    private getUserPermissions(user_id: string) {
        return {
            id: user_id,
            allow: PermissionFlagsBits.Connect | PermissionFlagsBits.ViewChannel,
            deny: BigInt(0),
        };
    }

    private getParentChannelPermissions(parent: CategoryChannel) {
        return parent.permissionOverwrites.cache.map(overwrites => ({
            id: overwrites.id,
            allow: overwrites.allow.bitfield,
            deny: overwrites.deny.bitfield,
        }));
    }

    private shouldCreateChannel(oldState: VoiceState, newState: VoiceState, channel_id: string): boolean {
        return (newState.channelId === channel_id && oldState.channelId !== channel_id) ||
            (newState.channelId === channel_id && !oldState.channelId);
    }

    private async buildChannel(guild: Guild, name: string, userLimit: number, parent: CategoryChannel, permissions: OverwriteResolvable[]) {
        try {
            return await guild.channels.create({
                name: name,
                type: ChannelType.GuildVoice,
                userLimit: userLimit,
                parent: parent,
                permissionOverwrites: permissions
            });
        } catch (error) {
            this.logger.error(`Error while creating a channel: ${error}`, { guildId: guild.id });
            return null;
        }
    }

    private setChannelPermissions(parent: CategoryChannel, user_id: string) {
        const user_permissions = this.getUserPermissions(user_id);
        const parent_permissions = this.getParentChannelPermissions(parent);
        parent_permissions.push(user_permissions);
        return parent_permissions;
    }

    private async setChannelDetails(user_id: string, parent: CategoryChannel, newState: VoiceState) {
        try {
            const user_channel_info = await this.getUserChannelInfo(user_id);
            return {
                name: user_channel_info?.channelName || `${newState.member?.user.username}'s Channel`,
                type: ChannelType.GuildVoice,
                userLimit: user_channel_info?.channelLimit || 0,
                permissions: this.setChannelPermissions(parent, user_id),
            };
        } catch (error) {
            this.logger.error(`Error fetching user channel info for user ${user_id}: ${error}`, { userId: user_id });
            return null;
        }
    }

    private async getUserChannelInfo(userId: string) {
        try {
            return await this.prisma.iUsersVoice.findUnique({
                where: {
                    userId: userId
                }
            });
        } catch (error) {
            this.logger.error(`Error fetching user channel info for user ${userId}: ${error}`, { userId: userId });
            return null;
        }

    }

    private async storeChannelInDatabase(guildId: string, channelId: string, categoryId: string, userId: string) {
        try {
            setTimeout(async () => {
                await this.prisma.voices.create({
                    data: {
                        guildId: guildId,
                        channelId: channelId,
                        channelCategoryId: categoryId,
                        channelOwnerId: userId
                    }
                });
            }, 500);
        } catch (error) {
            this.logger.error(`Error storing channel in database: ${error}`, { guildId: guildId, channelId: channelId, userId: userId });
        }
    }

    private async retreiveChannelsDataFromDatabase(channelId: string, guildId: string) {
        const data = await this.prisma.iVoices.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guildId,
                    channelId: channelId
                }
            }
        });
        return data;
    }
}