import { VoiceState, VoiceChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { ServerLogger } from "@logger";

export class VoiceDeleteHelper {
    private readonly prisma: PrismaClient;
    private readonly Logger: ServerLogger;
    constructor() {
        this.prisma = new PrismaClient();
        this.Logger = new ServerLogger();
    }

    public async deleteChannel(voiceChannel: VoiceChannel, guildId: string) {
        try {
            if (voiceChannel) {
                await voiceChannel.delete();
            }
            const existingRecord = await this.findExistingChannel(guildId, voiceChannel);
            if (existingRecord) {
                await this.prisma.activeTempVoice.delete({
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
        return this.prisma.activeTempVoice.findUnique({
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
