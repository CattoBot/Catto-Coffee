import { VoiceChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { ServerLogger } from "@logger";
import { Prisma } from "@lib/database/prisma";

export class VoiceChannelDeleteHelper extends Prisma {
    public readonly Logger: ServerLogger;

    public constructor() {
        super();
        this.Logger = new ServerLogger();
    }

    public async findExistingChannel(guildId: string, voiceChannel: VoiceChannel) {
        return this.activeTempVoice.findUnique({
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
            await this.activeTempVoice.delete({
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
