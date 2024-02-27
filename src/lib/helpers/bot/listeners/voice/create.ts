import { Guild, CategoryChannel, VoiceState, ChannelType, PermissionFlagsBits, OverwriteResolvable } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Config } from '@core/config';
import { ServerLogger } from '@logger';
import { Time } from '@sapphire/time-utilities';
let cooldown = new Map<string, number>();

export class VoiceCreateHelper {
    private readonly prisma: PrismaClient;
    private readonly Logger: ServerLogger;
    
    public constructor() {
        this.prisma = new PrismaClient();
        this.Logger = new ServerLogger();
    }

    public async initChannel(newState: VoiceState, oldState: VoiceState) {
        const channels = await this.getChannel(newState.guild.id);
        await Promise.all(channels.map(async ({ channel_id, parent_id }) => {
            const parent = newState.guild.channels.resolve(parent_id) as CategoryChannel;
            if (this.shouldCreateChannel(oldState, newState, channel_id)) {
                await this.createChannel(newState.guild, parent, newState.member.id, newState);
            }
        }));
    }

    private async createChannel(guild: Guild, parent: CategoryChannel, user_id: string, newState: VoiceState) {
        const user_cooldown = await this.getUserCooldown(user_id);
        if (user_cooldown && user_cooldown > Date.now()) {
            return;
        }

        this.setUserCooldown(user_id);
        const channel_details = await this.setChannelDetails(user_id, parent, newState);
        const channel = await this.buildChannel(guild, channel_details.name, channel_details.userLimit, parent, channel_details.permissions);
        try {
            await newState.setChannel(channel);
            await this.storeChannelInDatabase(guild.id, channel.id, parent.id, user_id);
        } catch (error) {
            this.Logger.error(`Error while creating the channel: ${error}`);
        }
    }

    private async getChannel(id: string) {
        const data = await this.prisma.tempChannel.findMany({
            where: {
                guildId: id
            }
        });

        return data.map((channel) => ({
            channel_id: channel.id,
            parent_id: channel.categoryId,
        }));
    }

    private async getUserChannelInfo(user_id: string) {
        return this.prisma.usersTempVoiceConfiguration.findUnique({
            where: {
                id: user_id
            }
        });
    }


    private async getUserCooldown(user_id: string): Promise<number | undefined> {
        return cooldown.get(user_id);
    }

    private setUserCooldown(user_id: string) {
        cooldown.set(user_id, Date.now() + Time.Second * Config.ChannelCreateCooldown);
    }

    private getUserPermissions(user_id: string) {
        return {
            id: user_id,
            allow: PermissionFlagsBits.Connect | PermissionFlagsBits.ViewChannel,
            deny: BigInt(0),
        };
    }

    private getParentChannelPermissions(parent: CategoryChannel) {
        return parent.permissionOverwrites.cache.map((overwrites) => ({
            id: overwrites.id,
            allow: overwrites.allow.bitfield,
            deny: overwrites.deny.bitfield,
        }));
    }


    private shouldCreateChannel(OldState: VoiceState, NewState: VoiceState, channel_id: string): boolean {
        return (
            (NewState.channelId === channel_id && OldState.channelId !== channel_id) ||
            (NewState.channelId === channel_id && !OldState.channelId)
        );
    }

    private async buildChannel(guild: Guild, name: string, userLimit: number, parent: CategoryChannel, permissions: OverwriteResolvable[]) {
        try {
            const createdChannel = await guild.channels.create({
                name: name,
                type: ChannelType.GuildVoice,
                userLimit: userLimit,
                parent: parent,
                permissionOverwrites: permissions
            });

            return createdChannel;
        } catch (error) {
            this.Logger.error(`Error while creating the channel: ${error}`);
        }
    }

    private setChannelPermissions(parent: CategoryChannel, user_id: string) {
        const user_permissions = this.getUserPermissions(user_id);
        const parent_permissions = this.getParentChannelPermissions(parent);
        parent_permissions.push(user_permissions);
        return parent_permissions;
    }


    private async setChannelDetails(user_id: string, parent: CategoryChannel, NewState: VoiceState) {
        const user_channel_info = await this.getUserChannelInfo(user_id);
        return {
            name: user_channel_info?.channelName || `${NewState.member?.user.username}'s Channel`,
            type: ChannelType.GuildVoice,
            userLimit: user_channel_info?.channelLimit || 0,
            permissions: this.setChannelPermissions(parent, user_id),
        }
    }

    private async storeChannelInDatabase(guildId: string, channelId: string, categoryId: string, userId: string) {
        await this.prisma.activeTempVoice.create({
            data: {
                id: channelId,
                guildId: guildId,
                channelCategoryId: categoryId,
                channelOwner: userId
            }
        })
    }
}
