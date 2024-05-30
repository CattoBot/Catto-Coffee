import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { TextChannel, GuildChannel } from "discord.js";
import { Emojis } from "../../../shared/enum/Emojis";
import { LeaderboardType } from "../../../shared/enum/LeaderboardType";

export class IntervalLeaderboardCommand {
    public static async run(interaction: Subcommand.ChatInputCommandInteraction, type: LeaderboardType) {
        const channel = interaction.options.getChannel('channel', true) as GuildChannel;

        if (!(channel instanceof TextChannel)) {
            return this.replyWithInvalidChannel(interaction);
        }

        const channelExists = await container.prisma.leaderboard_channels.findUnique({
            where: { guildId: interaction.guild!.id }
        });

        if (channelExists) {
            await container.prisma.leaderboard_channels.update({
                where: { guildId: interaction.guild!.id },
                data: { [type]: channel.id }
            });

            await this.updateLeaderboardTable(interaction.guild!.id, type);

            return await interaction.reply({
                content: await resolveKey(interaction, `commands/replies/admin:${type}_channel_update`, { channel: channel, emoji: Emojis.SUCCESS }),
                ephemeral: false
            });
        }

        await container.prisma.leaderboard_channels.create({
            data: {
                guildId: interaction.guild!.id,
                [type]: channel.id
            }
        });

        await this.updateLeaderboardTable(interaction.guild!.id, type);

        return await interaction.reply({
            content: await resolveKey(interaction, `commands/replies/admin:${type}_channel_add`, { channel: channel, emoji: Emojis.SUCCESS }),
            ephemeral: false
        });
    }

    private static async updateLeaderboardTable(guildId: string, type: LeaderboardType) {
        switch (type) {
            case LeaderboardType.Daily:
                await container.prisma.daily_top.upsert({
                    where: { guildId: guildId },
                    update: {},
                    create: { guildId: guildId }
                });
                break;
            case LeaderboardType.Weekly:
                await container.prisma.weekly_top.upsert({
                    where: { guildId: guildId },
                    update: {},
                    create: { guildId: guildId }
                });
                break;
            case LeaderboardType.Monthly:
                await container.prisma.monthly_top.upsert({
                    where: { guildId: guildId },
                    update: {},
                    create: { guildId: guildId }
                });
                break;
        }
    }

    public static async dailyRun(interaction: Subcommand.ChatInputCommandInteraction) {
        return this.run(interaction, LeaderboardType.Daily);
    }

    public static async weeklyRun(interaction: Subcommand.ChatInputCommandInteraction) {
        return this.run(interaction, LeaderboardType.Weekly);
    }

    public static async monthlyRun(interaction: Subcommand.ChatInputCommandInteraction) {
        return this.run(interaction, LeaderboardType.Monthly);
    }

    private static async replyWithInvalidChannel(interaction: Subcommand.ChatInputCommandInteraction) {
        return interaction.reply({
            content: await resolveKey(interaction, `commands/replies/error:invalid_channel`),
            ephemeral: true
        });
    }
}
