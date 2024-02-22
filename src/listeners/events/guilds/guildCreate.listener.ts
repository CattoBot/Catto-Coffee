import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { ServerLogger } from "@lib/helpers/misc/logger.helper";
import { Guild } from "discord.js";
import { Prisma } from "@lib/services/prisma.service";


@ApplyOptions<ListenerOptions>({ once: false, event: Events.GuildCreate })
export class GuildCreateListener extends Listener {
    public log: ServerLogger = ServerLogger.getInstance();
    public db = Prisma.getPrisma();
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(guild: Guild) {
        return this.db.guild.create({
            data: {
                id: guild.id
            }
        })
    }
}
