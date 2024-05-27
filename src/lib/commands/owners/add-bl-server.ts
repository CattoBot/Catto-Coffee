import { Command, container } from "@sapphire/framework";
import { Embed } from "../../classes/Embed";
import { Guild } from "discord.js";

export class AddServerBlacklistCommand {
    public static async run(interaction: Command.ChatInputCommandInteraction) {
        const guildId = interaction.options.getString('server', true);

        let fetchGuild: Guild;
        try {
            fetchGuild = await interaction.client.guilds.fetch(guildId);
        } catch (error) {
            console.error('Error fetching guild from Discord:', error);
            await interaction.reply({
                content: "Failed to fetch the guild with the provided ID. Please ensure it's correct and the bot has access to it.",
                ephemeral: true
            });
            return;
        }

        const key = `blacklisted:guild:${guildId}`;
        const isBlacklisted = await this.fetchGuildInRedis(key);
        const guild = await this.fetchGuild(guildId);

        if (isBlacklisted || guild) {
            await interaction.reply({
                embeds: [new Embed(`The guild \`${fetchGuild.name}\`(\`${guildId}\`) is already blacklisted.`)]
            });
        } else {
            try {
                await this.addToDatabase(guildId);
                await this.addToRedis(key);
                return await interaction.reply({
                    embeds: [new Embed(`The guild \`${fetchGuild.name}\`(\`${guildId}\`) has been added to the blacklist.`)]
                });
            } catch (error) {
                console.error('Error during addition to database or Redis:', error);
                return await interaction.reply({
                    content: "Failed to add the guild to the blacklist due to an internal error.",
                    ephemeral: true
                });
            }
        }

        return await interaction.reply({
            content: 'An unexpected error occurred.',
            ephemeral: true
        });
    }

    private static async addToDatabase(guildId: string) {
        await container.prisma.bot_black_listed_guilds.create({
            data: { guildId: guildId }
        });
    }

    private static async addToRedis(key: string) {
        await container.redis.set(key, 'true', 'EX', 3600);
    }

    private static async fetchGuildInRedis(key: string): Promise<boolean> {
        const result = await container.redis.get(key);
        return result === 'true';
    }

    private static async fetchGuild(guildId: string) {
        return await container.prisma.bot_black_listed_guilds.findUnique({
            where: { guildId: guildId }
        });
    }
}
