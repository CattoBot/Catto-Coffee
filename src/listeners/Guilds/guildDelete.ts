import { Listener, Events } from "@sapphire/framework";
import { Guild } from "discord.js";
import { Database } from "../../structures/Database";

export class GuildDeleteListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
      super(context, {
        ...options,
        once: false,
        event: Events.GuildDelete,
      });
    }

    public async run(Guild:Guild){
        await Database.$queryRaw`DELETE FROM ConfigTempChannels WHERE GuildID = ${Guild.id}`
    }
}