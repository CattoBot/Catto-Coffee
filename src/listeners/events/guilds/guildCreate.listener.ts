import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Guild } from "discord.js";
import { PrismaClient } from "@prisma/client";

@ApplyOptions<ListenerOptions>({ once: false, event: Events.GuildCreate })
export class GuildCreateListener extends Listener {
    public prisma: PrismaClient
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
        this.prisma = new PrismaClient();
    }

    public async run(guild: Guild) {
        return this.prisma.guild.create({
            data: {
                id: guild.id
            }
        })
    }
}
