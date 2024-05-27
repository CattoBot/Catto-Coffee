import { Command, container } from "@sapphire/framework";
import { Embed } from "../../classes/Embed";

export class RemoveServerBlacklistCommand {
    public static async run(interaction: Command.ChatInputCommandInteraction) {
        const guildId = interaction.options.getString('server', true);

        try {
            const guild = await this.fetchGuild(guildId);
            if (!guild) {
                await interaction.reply({
                    embeds: [new Embed(`The guild \`${guildId}\` is not blacklisted.`)]
                });
                return;
            }

            await this.removeFromDatabase(guildId);
            await this.removeFromRedis(`blacklisted:guild:${guildId}`);
           return await interaction.reply({
                embeds: [new Embed(`The guild \`${guildId}\` has been removed from the blacklist.`)]
            });
        } catch (error) {
            console.error('Error during removal process:', error);
           return await interaction.reply({
                content: "Failed to remove the guild from the blacklist due to an internal error.",
                ephemeral: true
            });
        }
    }

    private static async removeFromDatabase(guildId: string) {
        await container.prisma.bot_black_listed_guilds.delete({
            where: { guildId: guildId }
        });
    }

    private static async removeFromRedis(key: string) {
        await container.redis.del(key);
    }

    public static async fetchGuild(guildId: string) {
        return await container.prisma.bot_black_listed_guilds.findUnique({
            where: { guildId: guildId }
        });
    }
}
