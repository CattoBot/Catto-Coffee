import { container } from "@sapphire/pieces";
import { Helper } from "./helper";
import { TrustedVoiceUsers } from "@prisma/client";

export class VoiceHelper extends Helper {
    public static async find(channel_id: string, guild_id: string) {
        const channel = await container.prisma.voiceTempChannels.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guild_id,
                    channelId: channel_id
                }
            },
        });

        return channel;
    }

    
    public static async findTrusted(channelId: string, guildId: string, userId: string) {
        const user = await container.prisma.trustedVoiceUsers.findUnique({
            where: {
                guildId_channelId_userId: {
                    guildId: guildId, channelId: channelId, userId: userId
                }, AND: { userId: userId }
            }
        })

        return user;
    }

    public static async store(channelId: string, userId: string, guildId: string): Promise<TrustedVoiceUsers> {
        return await container.prisma.trustedVoiceUsers.create({
            data: {
                userId: userId,
                channelId: channelId,
                guildId: guildId
            }
        })
    }

    public static async getVoiceChannelOwner(channelId: string, guildId: string) {
        const owner = await container.prisma.voiceTempChannels.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guildId,
                    channelId: channelId,
                }
            }
        })
        return owner!.channelOwnerId ?? null;
    }
    
    public static async findUser(channelId: string, guildId: string, userId: string) {
        const user = await container.prisma.trustedVoiceUsers.findUnique({
            where: {
                guildId_channelId_userId: {
                    guildId: guildId, channelId: channelId, userId: userId
                }
            }
        })

        return user;
    }

    public static async delete(channelId: string, userId: string, guildId: string): Promise<TrustedVoiceUsers> {
        return await container.prisma.trustedVoiceUsers.delete({
            where: {
                guildId_channelId_userId: {
                    guildId: guildId, channelId: channelId, userId: userId
                }
            }
        })
    }

}