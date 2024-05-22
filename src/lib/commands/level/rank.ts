import { Subcommand } from "@sapphire/plugin-subcommands";
import { TextRankButtonRow, VoiceRankButtonRow } from "../../../shared/bot/buttons/LevelingButtonts";
import { DrawCanvas } from "../../classes/Canvas";
import { registeringFONT, formatNumber, experienceFormula } from "../../utils";
import { EmbedBuilder } from "discord.js";
import { resolveKey } from "@sapphire/plugin-i18next";
import { LevelingHelper } from "../../helpers/leveling.helper";

export class CattoRankCommand extends LevelingHelper {
    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        const guildId = interaction.guildId!;
        const voiceEnabled = await this.getVoiceXPEnabled(guildId);
        const textEnabled = await this.getTextXPEnabled(guildId);

        if (!voiceEnabled && !textEnabled) {
            await interaction.followUp({ content: await resolveKey(interaction, `commands/replies/level:rank_not_enabled`), ephemeral: true });
            return;
        }

        if (voiceEnabled) {
            await this.buildVoiceCard(interaction);
        } else if (textEnabled) {
            await this.buildTextCard(interaction);
        }
    }

    private static async buildVoiceCard(interaction: Subcommand.ChatInputCommandInteraction): Promise<void> {
        registeringFONT();
        const user = interaction.options.getUser('user') ?? interaction.user;
        if (user.bot) {
            await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:rank_not_bots`) });
            return;
        }

        const info = await this.getVoiceUserInfo(user.id, interaction.guildId!);
        if (!info) {
            await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:rank_not_data`) });
            return;
        }

        const rank = await this.getVoiceRank(user.id, interaction.guildId!);
        const level = info.voiceLevel ?? 0;
        const experience = info.voiceExperience ?? 0;
        const requiredXP = experienceFormula(level + 1);
        const formattedRank = formatNumber(rank ?? 0);

        const avatarURL = user.displayAvatarURL({ extension: 'jpg', size: 512 });
        const buffer = await DrawCanvas.generateUserRankImage(
            { userId: user.id, username: user.username, displayAvatarURL: user.displayAvatarURL, textExperience: experience, level },
            interaction.guild?.id!,
            formattedRank,
            requiredXP,
            experience,
            avatarURL
        );

        await interaction.editReply({
            components: [TextRankButtonRow],
            files: [{ attachment: buffer, name: 'rank.png' }]
        });
    }

    private static async buildTextCard(interaction: Subcommand.ChatInputCommandInteraction): Promise<void> {
        registeringFONT();
        const user = interaction.options.getUser('user') ?? interaction.user;
        if (user.bot) {
            await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:rank_not_bots`) });
            return;
        }

        const info = await this.getTextUserInfo(user.id, interaction.guildId!);
        if (!info) {
            await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:rank_not_data`) });
            return;
        }

        const rank = await this.getTextRank(user.id, interaction.guildId!);
        const level = info.textLevel ?? 0;
        const experience = info.textExperience ?? 0;
        const requiredXP = experienceFormula(level + 1);
        const formattedRank = formatNumber(rank ?? 0);
        const formattedRequiredXP = formatNumber(requiredXP);
        const formattedXP = formatNumber(experience ?? 0);

        const avatarURL = user.displayAvatarURL({ extension: 'jpg', size: 128 });
        const buffer = await DrawCanvas.generateUserRankImage(
            {
                userId: user.id,
                username: user.username,
                displayAvatarURL: user.displayAvatarURL,
                textExperience: experience,
                level
            },
            interaction.guild?.id!,
            formattedRank,
            requiredXP,
            experience,
            avatarURL
        );

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Text Rank`)
            .setDescription(`Level: ${level} - XP: ${formattedXP}/${formattedRequiredXP}`)
            .setImage('attachment://rank.png');

        await interaction.editReply({
            embeds: [embed],
            components: [VoiceRankButtonRow],
            files: [{ attachment: buffer, name: 'rank.png' }]
        });
    }
}
