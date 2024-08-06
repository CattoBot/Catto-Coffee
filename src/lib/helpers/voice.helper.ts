import { container } from "@sapphire/pieces";
import { Helper } from "./helper";
import { trusted_voice_users } from "@prisma/client";

export class VoiceHelper extends Helper {
    public async find(channel_id: string, guild_id: string) {
        const channel = await container.prisma.voice_temp_channels.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guild_id,
                    channelId: channel_id
                }
            },
        });

        return channel;
    }

    
    public async findTrusted(channelId: string, guildId: string, userId: string) {
        const user = await container.prisma.trusted_voice_users.findUnique({
            where: {
                guildId_channelId_userId: {
                    guildId: guildId, channelId: channelId, userId: userId
                }, AND: { userId: userId }
            }
        })

        return user;
    }

    public async store(channelId: string, userId: string, guildId: string): Promise<trusted_voice_users> {
        return await container.prisma.trusted_voice_users.create({
            data: {
                userId: userId,
                channelId: channelId,
                guildId: guildId
            }
        })
    }

    public async getVoiceChannelOwner(channelId: string, guildId: string) {
        const owner = await container.prisma.voice_temp_channels.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guildId,
                    channelId: channelId,
                }
            }
        })
        return owner!.channelOwnerId ?? null;
    }
    
    public async findUser(channelId: string, guildId: string, userId: string) {
        const user = await container.prisma.trusted_voice_users.findUnique({
            where: {
                guildId_channelId_userId: {
                    guildId: guildId, channelId: channelId, userId: userId
                }
            }
        })

        return user;
    }

    public async delete(channelId: string, userId: string, guildId: string): Promise<trusted_voice_users> {
        return await container.prisma.trusted_voice_users.delete({
            where: {
                guildId_channelId_userId: {
                    guildId: guildId, channelId: channelId, userId: userId
                }
            }
        })
    }
}