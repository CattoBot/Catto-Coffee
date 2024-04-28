import { VoiceChannel } from "discord.js";
import { logger, ServerLogger } from "@logger";
import { Prisma, PrismaCoreModule } from "@lib/database/prisma";

export class OnClickVoiceDeleteChannelHelper {
    private readonly Logger: ServerLogger
    private readonly prisma: PrismaCoreModule
    constructor() {
        this.prisma = Prisma;
        this.Logger = logger;
    }

    public async findExistingChannel(guildId: string, voiceChannel: VoiceChannel) {
        try {
            return this.prisma.voices.findUnique({
                where: {
                    guildId_channelId: {
                        guildId: guildId,
                        channelId: voiceChannel.id,
                    },
                },
            });
        } catch (error) {
            this.Logger.error(`Error while finding existing voice channel: ${error}`);
        }
    }

    public async deleteChannel(voiceChannel: VoiceChannel, guildId: string) {
        try {
            setTimeout(async () => {
                await this.prisma.voices.delete({
                    where: {
                        guildId_channelId: {
                            guildId: guildId,
                            channelId: voiceChannel.id,
                        },
                    },
                });
            }, 1000);
        } catch (error) {
            this.Logger.error(`Error while deleting voice channel: ${error}`);
        }
    }
}
