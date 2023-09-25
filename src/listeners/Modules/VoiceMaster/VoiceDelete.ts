import { Listener, Events } from "@sapphire/framework";
import { VoiceState, VoiceChannel } from "discord.js";
import { Database } from "../../../structures/Database";

export class DeleteVoiceListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            once: false,
            event: Events.VoiceStateUpdate,
        });
    }

    public async run(oldState: VoiceState, newState: VoiceState) {
        try {
            const { channel, channelId } = oldState;
            if (channel && channelId !== newState.channelId && channel.members.size === 0) {
                const voiceChannel = channel as VoiceChannel;
                const guild = voiceChannel.guild;
                const existingChannel = await Database.activeTempVoices.findUnique({
                    where: { GuildID_ChannelID: { GuildID: guild.id, ChannelID: voiceChannel.id } }
                });
    
                if (existingChannel) {
                    await Promise.all([
                        voiceChannel.delete().then(() => {
                            Database.activeTempVoices.delete({ where: { GuildID_ChannelID: { GuildID: guild.id, ChannelID: voiceChannel.id } } })
                        }),
    
                    ])
                }
            }
        } catch (error) {
            
        }

    }
}