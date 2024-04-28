import { VoiceState, VoiceChannel } from "discord.js";
import { logger, ServerLogger } from "@logger";
import { Prisma, PrismaCoreModule } from "@lib/database/prisma";

export class VoiceDeleteHelper {
    private readonly Logger: ServerLogger
    private readonly prisma: PrismaCoreModule
    
    constructor() {
        this.prisma = Prisma;
        this.Logger = logger;
    }

    public async deleteChannel(voiceChannel: VoiceChannel, guildId: string) {
        try {
            await voiceChannel.delete();
            await this.deleteTrustedUsers(voiceChannel.id);
        } catch (error) {
            this.Logger.error(`Error while deleting voice channel: ${error}`);
        }
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

    public shouldDeleteChannel(oldState: VoiceState, newState: VoiceState): boolean {
        const { channel, channelId } = oldState;
        return channel && channelId !== newState.channelId && channel.members.size === 0;
    }

    private async deleteTrustedUsers(channelId: string) {
        return await this.prisma.voiceUsers.deleteMany({
            where: {
                channelId: channelId
            }
        })
    }
}
