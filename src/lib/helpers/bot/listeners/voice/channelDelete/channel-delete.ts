import { VoiceChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { ServerLogger } from "@logger";

export class VoiceChannelDeleteHelper {

    private readonly prisma: PrismaClient;
    public readonly Logger: ServerLogger;

    public constructor() {
        this.Logger = new ServerLogger();
        this.prisma = new PrismaClient();
    }

    public async findExistingChannel(guildId: string, voiceChannel: VoiceChannel) {
        return this.prisma.activeTempVoice.findUnique({
            where: {
                id_guildId: {
                    guildId: guildId,
                    id: voiceChannel.id,
                },
            },
        });
    }

    public async deleteChannel(voiceChannel: VoiceChannel, guildId: string) {
        try {
            await this.prisma.activeTempVoice.delete({
                where: {
                    id_guildId: {
                        guildId: guildId,
                        id: voiceChannel.id,
                    },
                },
            });
        } catch (error) {
            this.Logger.error(`Error while deleting voice channel: ${error}`);
        }
    }
}
