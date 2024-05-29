import { Guild, CategoryChannel, VoiceState, ChannelType, PermissionFlagsBits, OverwriteResolvable, VoiceChannel } from 'discord.js';
import { container } from '@sapphire/pieces';
import { ChannelConfig } from '../../../shared/interfaces/ChannelConfig';
import { Time } from '@sapphire/time-utilities';
import { Helper } from '../helper';

export class VoiceCreateHelper extends Helper {
    public async initChannel(newState: VoiceState, oldState: VoiceState): Promise<void> {
        if (!newState.guild) return;
        try {
            const channels = await this.getChannel(newState.guild.id);
            for (const channel of channels) {
                await this.attemptChannelCreation(channel, newState, oldState);
            }
        } catch (error) {
            container.console.error(`Error in initializing channels: ${error}`, { guildId: newState.guild.id });
        }
    }

    private async attemptChannelCreation(channelConfig: ChannelConfig, newState: VoiceState, oldState: VoiceState): Promise<void> {
        const { channel_id, parent_id } = channelConfig;
        const parent = newState.guild.channels.resolve(parent_id) as CategoryChannel;
        if (!parent) {
            return;
        }
        if (this.shouldCreateChannel(oldState, newState, channel_id)) {
            await this.createChannel(newState.guild, parent, newState.member!.id, newState);
        }
    }

    private async createChannel(guild: Guild, parent: CategoryChannel, user_id: string, newState: VoiceState): Promise<void> {
        const user_cooldown = await this.getUserCooldown(user_id);
        if (user_cooldown && user_cooldown > Date.now()) return;
        await this.setUserCooldown(user_id);
        const channel_details = await this.setChannelDetails(user_id, parent, newState, guild.id, newState.channelId!);
        if (!channel_details) return;

        const channel = await this.buildChannel(guild, channel_details.name, channel_details.userLimit, parent, channel_details.permissions);
        if (!channel) return;

        try {
            await newState.setChannel(channel);
        } catch (error) {
            container.console.error(`Error while creating the channel for user ${user_id}: ${error}`, { userId: user_id });
            throw new Error(`Failed to create channel: ${error}`);
        }
        await this.storeChannelInDatabase(guild.id, channel.id, parent.id, user_id);
    }

    private async getChannel(guildId: string): Promise<ChannelConfig[]> {
        try {
            const data = await container.prisma.i_voice_temp_channels.findMany({
                where: {
                    guildId: guildId
                }
            });
            return data.map(({ channelId, categoryId }) => ({ channel_id: channelId, parent_id: categoryId }));
        } catch (error) {
            container.console.error(`Failed to retrieve channels for guild ${guildId}: ${error}`, { guildId });
            return [];
        }
    }

    private async getUserCooldown(user_id: string): Promise<number | undefined> {
        try {
            const cooldown = await container.redis.get(`voiceCreate:cooldown:${user_id}`);
            return cooldown ? parseInt(cooldown) : undefined;
        } catch (error) {
            container.console.error(`Error retrieving cooldown for user ${user_id}: ${error}`, { userId: user_id });
            return undefined;
        }
    }

    private async setUserCooldown(user_id: string): Promise<void> {
        const cooldownPeriod = Time.Second * 30;
        try {
            const expirationTime = Date.now() + cooldownPeriod;
            await container.redis.set(`voiceCreate:cooldown:${user_id}`, expirationTime, 'PX', cooldownPeriod);
        } catch (error) {
            container.console.error(`Error setting cooldown for user ${user_id}: ${error}`, { userId: user_id });
        }
    }

    private getUserPermissions(user_id: string): OverwriteResolvable {
        return {
            id: user_id,
            allow: PermissionFlagsBits.Connect | PermissionFlagsBits.ViewChannel,
            deny: BigInt(0),
        };
    }

    private getParentChannelPermissions(parent: CategoryChannel): OverwriteResolvable[] {
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

    private async buildChannel(guild: Guild, name: string, userLimit: number, parent: CategoryChannel, permissions: OverwriteResolvable[]): Promise<VoiceChannel | null> {
        try {
            return await guild.channels.create({
                name: name,
                type: ChannelType.GuildVoice,
                userLimit: userLimit,
                parent: parent,
                permissionOverwrites: permissions
            });
        } catch (error) {
            return null;
        }
    }

    private setChannelPermissions(parent: CategoryChannel, user_id: string): OverwriteResolvable[] {
        const user_permissions = this.getUserPermissions(user_id);
        const parent_permissions = this.getParentChannelPermissions(parent);
        parent_permissions.push(user_permissions);
        return parent_permissions;
    }

    private async setChannelDetails(user_id: string, parent: CategoryChannel, newState: VoiceState, guildId: string, channelId: string): Promise<{ name: string, userLimit: number, permissions: OverwriteResolvable[] } | null> {
        try {
            const shouldUseUserSettings = await this.shouldUseUserSettings(guildId, channelId);
            let channelInfo;

            if (shouldUseUserSettings) {
                channelInfo = await this.getUserChannelInfo(user_id);
                if (!channelInfo || !channelInfo.channelName) {
                    channelInfo = await this.retrieveDefaultChannelSettings(guildId, channelId, newState);
                }
            } else {
                channelInfo = await this.retrieveDefaultChannelSettings(guildId, channelId, newState);
            }

            return {
                name: channelInfo?.channelName!,
                userLimit: channelInfo?.channelLimit || 0,
                permissions: this.setChannelPermissions(parent, user_id),
            };

        } catch (error) {
            container.console.error(`Error fetching channel info for user ${user_id}: ${error}`, { userId: user_id });
            return null;
        }
    }


    private async getUserChannelInfo(userId: string): Promise<{ channelName: string, channelLimit: number } | null> {
        try {
            const user = await container.prisma.i_users_temp_voice.findUnique({
                where: {
                    userId: userId
                }
            });
            return {
                channelName: user?.channelName || '',
                channelLimit: user?.channelLimit || 0
            }
        } catch (error) {
            container.console.error(`Error fetching user channel info for user ${userId}: ${error}`, { userId: userId });
            return null;
        }
    }

    private async storeChannelInDatabase(guildId: string, channelId: string, categoryId: string, userId: string): Promise<void> {
        try {
            setTimeout(async () => {
                await container.prisma.voice_temp_channels.create({
                    data: {
                        guildId: guildId,
                        channelId: channelId,
                        channelCategoryId: categoryId,
                        channelOwnerId: userId
                    }
                })
            }, 500);

        } catch (error) {
            container.console.error(`Error storing channel in database: ${error}`, { guildId: guildId, channelId: channelId, userId: userId });
        }
    }

    private async retrieveDefaultChannelSettings(guildId: string, channelId: string, newState: VoiceState): Promise<{ channelName: string, channelLimit: number } | null> {
        try {
            const defaultSettings = await container.prisma.i_voice_temp_channels.findUnique({
                where: {
                    guildId_channelId: {
                        channelId: channelId,
                        guildId: guildId
                    }
                }
            });

            const channelName = defaultSettings?.channelName?.replace('{user}', newState.member?.displayName || '') || '';

            return {
                channelName,
                channelLimit: defaultSettings?.channelLimit || 0
            };
        } catch (error) {
            container.console.error(`Error fetching default channel settings for guild ${guildId}: ${error}`, { guildId });
            return null;
        }
    }

    private async shouldUseUserSettings(guildId: string, channelId: string): Promise<boolean> {
        try {
            const defaultSettings = await container.prisma.i_voice_temp_channels.findUnique({
                where: {
                    guildId_channelId: {
                        channelId: channelId,
                        guildId: guildId
                    }
                }
            });

            if (defaultSettings) {
                const useUserSettings = defaultSettings.editables;
                return useUserSettings!;
            } else {
                return false;
            }
        } catch (error) {
            container.console.error(`Error fetching default channel settings for guild ${guildId}: ${error}`, { guildId });
            return false;
        }
    }
}
