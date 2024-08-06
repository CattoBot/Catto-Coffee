import { container } from "@sapphire/pieces";
import { VoiceState, VoiceChannel } from "discord.js";
import { Helper } from "../helper";

export class VoiceDeleteHelper extends Helper {
    private eventQueue: Array<{ oldState: VoiceState, newState: VoiceState }> = [];
    private isProcessingQueue: boolean = false;

    public async queueEvent(oldState: VoiceState, newState: VoiceState) {
        this.eventQueue.push({ oldState, newState });
        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }

    private async processQueue() {
        this.isProcessingQueue = true;

        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            if (event) {
                await this.handleEvent(event.oldState, event.newState)
            }
        }

        this.isProcessingQueue = false;
    }

    private async handleEvent(oldState: VoiceState, newState: VoiceState) {
        if (this.shouldDeleteChannel(oldState, newState)) {
            const { channel } = oldState as { channel: VoiceChannel };
            const existingChannel = await this.findExistingChannel(channel.guild.id, channel);
            if (existingChannel) {
                await this.deleteChannel(channel);
            }
        }
    }

    private shouldDeleteChannel(oldState: VoiceState, newState: VoiceState): boolean {
        const { channel, channelId } = oldState;
        return channel !== null && channelId !== newState.channelId && channel.members.size === 0;
    }

    private async deleteChannel(voiceChannel: VoiceChannel) {
        try {
            await voiceChannel.delete();
            await container.prisma.voice_temp_channels.delete({
                where: {
                    guildId_channelId: {
                        guildId: voiceChannel.guild.id,
                        channelId: voiceChannel.id,
                    },
                }
            });
            await this.deleteTrustedUsers(voiceChannel.id);
        } catch (error) {
            container.console.error(`Error deleting channel or database entry: ${error}`);
        }
    }

    private async findExistingChannel(guildId: string, voiceChannel: VoiceChannel) {
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

    private async deleteTrustedUsers(channelId: string) {
        try {
            await container.prisma.trusted_voice_users.deleteMany({
                where: {
                    channelId: channelId
                }
            });
        } catch (error) {
            container.console.error(`Error deleting trusted users: ${error}`);
        }
    }
}