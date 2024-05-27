import { container } from "@sapphire/pieces";
import { VoiceChannel } from "discord.js";
import { Helper } from "../helper";

export class onClickDefaultVoiceChannelDelete extends Helper {
    public async findExistingChannel(guildId: string, voiceChannel: VoiceChannel) {
        try {
            return container.prisma.i_voice_temp_channels.findUnique({
                where: {
                    guildId_channelId: {
                        guildId: guildId,
                        channelId: voiceChannel.id,
                    },
                },
            });
        } catch (error) {
            container.console.error(`Error while finding existing voice channel: ${error}`);
        }
        return null;
    }

    public async deleteChannel(voiceChannel: VoiceChannel, guildId: string) {
        try {
            setTimeout(async () => {
                await container.prisma.i_voice_temp_channels.delete({
                    where: {
                        guildId_channelId: {
                            guildId: guildId,
                            channelId: voiceChannel.id,
                        },
                    },
                });
            }, 1000);
        } catch (error) {
            container.console.error(`Error while deleting voice channel: ${error}`);
        }
    }
}
