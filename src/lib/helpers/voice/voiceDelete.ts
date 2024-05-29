import { container } from "@sapphire/pieces";
import { VoiceState, VoiceChannel } from "discord.js";
import { Helper } from "../helper";

export class VoiceDeleteHelper extends Helper {
    public async deleteChannel(voiceChannel: VoiceChannel) {
        await voiceChannel.delete().catch(() => null);
        await container.prisma.voice_temp_channels.delete({
            where: {
                guildId_channelId: {
                    guildId: voiceChannel.guild.id,
                    channelId: voiceChannel.id,
                },
            }
        }).catch(() => null)
        await this.deleteTrustedUsers(voiceChannel.id).catch(() => null);
    }

    public async findExistingChannel(guildId: string, voiceChannel: VoiceChannel) {
        try {
            const channel = await container.prisma.voice_temp_channels.findUnique({
                where: {
                    guildId_channelId: {
                        guildId: guildId,
                        channelId: voiceChannel.id,
                    },
                },
            });
            return channel;
        } catch (error) {
            container.console.error(`Error while finding existing voice channel: ${error}`);
        }
        return null;
    }

    public shouldDeleteChannel(oldState: VoiceState, newState: VoiceState): boolean {
        const { channel, channelId } = oldState;
        return channel !== null && channelId !== newState.channelId && channel.members.size === 0;
    }

    private async deleteTrustedUsers(channelId: string) {
        const users = await container.prisma.trusted_voice_users.deleteMany({
            where: {
                channelId: channelId
            }
        })
        return users;
    }
}
