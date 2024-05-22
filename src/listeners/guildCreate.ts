import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Guild } from "discord.js";

@ApplyOptions<ListenerOptions>({ once: false, event: Events.GuildCreate })
export class GuildCreateListener extends Listener {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(guild: Guild): Promise<void> {
        const guild_id = guild.id;
        const exists = await this.find(guild_id);
        if (!exists) {
            await this.create(guild_id);
            await this.createVoiceXP(guild_id);
            await this.createTextXP(guild_id);
        }
    }

    private async find(guild_id: string): Promise<boolean> {
        const guild = await this.container.prisma.guilds.findUnique({ where: { guildId: guild_id } });
        return guild !== null;
    }

    private async create(guild_id: string): Promise<object> {
        return this.container.prisma.guilds.create({ data: { guildId: guild_id } });
    }
    private async createVoiceXP(guild_id: string): Promise<object> {
        const guild = await this.container.prisma.iVoiceExperience.create({ data: { guildId: guild_id } });
        return guild;
    }
    private async createTextXP(guild_id: string): Promise<object> {
        const guild = await this.container.prisma.iTextExperience.create({ data: { guildId: guild_id } });
        return guild;
    }
}
