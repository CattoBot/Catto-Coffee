import { container } from "@sapphire/pieces";
import { VoiceChannel } from "discord.js";
import { Helper } from "../helper";

export class OnClickVoiceDeleteChannelHelper extends Helper {

    public async findExistingChannel(guildId: string, voiceChannel: VoiceChannel) {
        try {
            return container.prisma.voiceTempChannels.findUnique({
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
                await container.prisma.voiceTempChannels.delete({
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
