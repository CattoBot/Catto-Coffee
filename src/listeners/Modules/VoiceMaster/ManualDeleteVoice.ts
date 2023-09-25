import { Listener, Events } from "@sapphire/framework";
import { Database } from "../../../structures/Database";
import { VoiceChannel } from "discord.js";

export class ManualDeleteVoiceListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            once: false,
            event: Events.ChannelDelete,
        });
    }

    public async run(channel: VoiceChannel) {
        try {
            const tempVoice = await Database.activeTempVoices.findUnique({
                where: {
                    GuildID_ChannelID: {
                        GuildID: channel.guild.id,
                        ChannelID: channel.id,
                    },
                },
            });

            if (tempVoice) {
                await Database.activeTempVoices.delete({
                    where: {
                        GuildID_ChannelID: {
                            GuildID: channel.guild.id,
                            ChannelID: channel.id,
                        },
                    },
                })
            }
        } catch (error) {

        }

    }
}