import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Guild } from "discord.js";
import { Prisma, PrismaCoreModule } from "@lib/database/prisma";

@ApplyOptions<ListenerOptions>({ once: false, event: Events.GuildCreate })
export class GuildCreateListener extends Listener {
    public prisma: PrismaCoreModule;
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
        this.prisma = Prisma;
    }

    public async run(guild: Guild): Promise<Object> {
        if (await this.find(guild.id)) return;
        return this.prisma.guilds.create({ data: { guildId: guild.id } })
    }

    private async find(guild_id: string): Promise<Boolean> {
        await this.prisma.guilds.findUnique({ where: { guildId: guild_id } });
        return true;
    }
}
