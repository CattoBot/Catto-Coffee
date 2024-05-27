import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Guild, TextChannel } from "discord.js";

@ApplyOptions<ListenerOptions>({ once: false, event: Events.GuildCreate })
export class GuildCreateListener extends Listener {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(guild: Guild): Promise<void> {
        const channel = this.container.client.channels.resolve("1128070491878465606") as TextChannel
        await channel.send(`**[GUILD JOIN]** __[${this.container.client.guilds.cache.size}]__ \`${guild.name}\` (\`${guild.id}\`) ha agregado el bot. <a:pickaxe:1127394494350884974>`)
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
        const guild = await this.container.prisma.i_voice_experience.create({ data: { guildId: guild_id } });
        return guild;
    }
    private async createTextXP(guild_id: string): Promise<object> {
        const guild = await this.container.prisma.i_text_experience.create({ data: { guildId: guild_id } });
        return guild;
    }
}
