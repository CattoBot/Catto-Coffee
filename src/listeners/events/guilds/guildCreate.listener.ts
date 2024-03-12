import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Guild } from "discord.js";
import { Prisma } from "@lib/database/prisma";

@ApplyOptions<ListenerOptions>({ once: false, event: Events.GuildCreate })
export class GuildCreateListener extends Listener {
    public prisma: Prisma = new Prisma();
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(guild: Guild): Promise<Object> {
        if (await this.find(guild.id)) return;
        return this.prisma.guild.create({ data: { id: guild.id } })
    }

    private async find(guild_id: string): Promise<Boolean> {
        await this.prisma.guild.findUnique({ where: { id: guild_id } });
        return true;
    }
}
