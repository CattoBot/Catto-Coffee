import { Listener, Events } from "@sapphire/framework";
import { Database } from "../../../structures/Database";
import { CategoryChannel } from "discord.js";

export class DeleteCategoryListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            once: false,
            event: Events.ChannelDelete,
        });
    }

    public async run(channel: CategoryChannel) {
        try {
            const tempVoice = await Database.configTempChannels.findUnique({
                where: {
                    GuildID_TempVoiceCategory: {
                        GuildID: channel.guild.id,
                        TempVoiceCategory: channel.id
                    }
                },
            });

            if (tempVoice) {
                await Database.configTempChannels.delete({
                    where: { GuildID_TempVoiceCategory: { GuildID: channel.guild.id, TempVoiceCategory: channel.id } }
                })
            }
        } catch (error) {

        }

    }
}