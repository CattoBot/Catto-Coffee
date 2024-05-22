import { Command } from "@sapphire/framework";
import { Message } from "discord.js";
import { container } from '@sapphire/framework';
import { reply } from "@sapphire/plugin-editable-commands";
import { Embed } from "../../lib/classes/Embed";
import { Emojis } from "../../shared/enum/Emojis";

export class UptimeCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Check the bot\'s uptime.'
        });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description
        });
    }

    public override async messageRun(message: Message) {
        await message.channel.sendTyping();
        const uptime = this.calculateUptime(container.client.uptime);
        const dbUptime = await this.getDatabaseUptime();
        await reply(message, {
            embeds: [
                new Embed(`${Emojis.APP} **Application:** **\`${uptime}\`**\n${Emojis.DATABASE} **Database:** **\`${dbUptime}\`**`)
                    .setAuthor({ name: "General Uptime", iconURL: "https://cdn3.emoji.gg/emojis/4655-stopwatch.png" })
                    .setFooter({ text: "Uptime Information", iconURL: container.client.user?.displayAvatarURL() })
            ]
        });
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const uptime = this.calculateUptime(container.client.uptime);
        const dbUptime = await this.getDatabaseUptime();
        await interaction.reply({
            embeds: [
                new Embed(`${Emojis.APP} **Application:** **\`${uptime}\`**\n${Emojis.DATABASE} **Database:** **\`${dbUptime}\`**`)
                    .setAuthor({ name: "General Uptime", iconURL: "https://cdn3.emoji.gg/emojis/4655-stopwatch.png" })
                    .setFooter({ text: "Uptime Information", iconURL: container.client.user?.displayAvatarURL() })
            ]
        });
    }

    private calculateUptime(uptime: number | null): string {
        if (uptime === null) return 'No uptime data available.';

        const seconds = Math.floor((uptime / 1000) % 60);
        const minutes = Math.floor((uptime / (1000 * 60)) % 60);
        const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    private async getDatabaseUptime(): Promise<string> {
        type UptimeResult = { Variable_name: string; Value: string }[];
        const result = await this.container.prisma.$queryRaw<UptimeResult>`SHOW GLOBAL STATUS LIKE 'Uptime';`;
        const uptimeSeconds = parseInt(result[0].Value, 10);
        const seconds = uptimeSeconds % 60;
        const minutes = Math.floor((uptimeSeconds / 60) % 60);
        const hours = Math.floor((uptimeSeconds / (60 * 60)) % 24);
        const days = Math.floor(uptimeSeconds / (60 * 60 * 24));
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
}

