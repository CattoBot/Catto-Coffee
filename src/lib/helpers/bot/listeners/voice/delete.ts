import { VoiceState, VoiceChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { ServerLogger } from "@logger";
import { Prisma } from "@lib/database/prisma";

export class VoiceDeleteHelper extends Prisma {
    private readonly Logger: ServerLogger;

    constructor() {
        super();
    }

    public async deleteChannel(voiceChannel: VoiceChannel, guildId: string) {
        try {
            if (voiceChannel) {
                await voiceChannel.delete();
            }
            const existingRecord = await this.findExistingChannel(guildId, voiceChannel);
            if (existingRecord) {
                await this.activeTempVoice.delete({
                    where: {
                        id_guildId: {
                            guildId: guildId,
                            id: voiceChannel.id,
                        },
                    },
                });
            }
        } catch (error) {
            this.Logger.error(`Error while deleting voice channel: ${error}`);
        }
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

    public shouldDeleteChannel(oldState: VoiceState, newState: VoiceState): boolean {
        const { channel, channelId } = oldState;
        return channel && channelId !== newState.channelId && channel.members.size === 0;
    }
}
