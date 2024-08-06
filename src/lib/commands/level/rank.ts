import { Subcommand } from "@sapphire/plugin-subcommands";
import { TextRankButtonRow, VoiceRankButtonRow } from "../../../shared/bot/buttons/LevelingButtonts";
import { resolveKey } from "@sapphire/plugin-i18next";
import { container } from "@sapphire/pieces";
import { Emojis } from "../../../shared/enum/Emojis";
import { RankCardBuilder } from "../../classes/RankCard";
import { AvatarExtension } from "../../../shared/interfaces/UserInfo";

export class CattoRankCommand {
    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        const guildId = interaction.guildId!;
        const voiceEnabled = await container.helpers.leveling.getVoiceXPEnabled(guildId);
        const textEnabled = await container.helpers.leveling.getTextXPEnabled(guildId);

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
        container.helpers.canvas.registeringFONT();
        const user = interaction.options.getUser('user') ?? interaction.user;
        if (user.bot) {
            await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:rank_not_bots`) });
            return;
        }

        const info = await container.helpers.leveling.getVoiceUserInfo(user.id, interaction.guildId!);
        if (!info) {
            await this.buildTextCard(interaction);
            return;
        }

        const rank = await container.helpers.leveling.getVoiceRank(user.id, interaction.guildId!);
        const level = info.voiceLevel ?? 0;
        const experience = info.voiceExperience ?? 0;
        const requiredXP = container.utils.xp.experienceFormula(level + 1);
        const formattedRank = container.utils.numbers.format(rank ?? 0);

        const userInfo = {
            userId: user.id,
            username: user.username,
            displayAvatarURL: (options: { extension: AvatarExtension; size: 512 }) => user.displayAvatarURL(options),
            level: level,
            experience: experience,
            displayName: user.displayName,
        };

        const buffer = new RankCardBuilder()
            .setExperience(experience)
            .setAvatarURL(user.displayAvatarURL({ extension: 'jpg', size: 512 }))
            .setUser(userInfo)
            .setGuildId(interaction.guildId!)
            .setRequiredXP(requiredXP)
            .setRank(formattedRank)
        const rankCard = await buffer.build();

        await interaction.editReply({
            content: await resolveKey(interaction, `commands/replies/level:voice_card`, { emoji: Emojis.SUCCESS, user: user.displayName }),
            components: [TextRankButtonRow],
            files: [{ attachment: rankCard, name: 'rank.png' }]
        });
    }

    private static async buildTextCard(interaction: Subcommand.ChatInputCommandInteraction): Promise<void> {
        container.helpers.canvas.registeringFONT();
        const user = interaction.options.getUser('user') ?? interaction.user;
        if (user.bot) {
            await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:rank_not_bots`) });
            return;
        }

        const info = await container.helpers.leveling.getTextUserInfo(user.id, interaction.guildId!);
        if (!info) {
            await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:rank_not_data`) });
            return;
        }

        const rank = await container.helpers.leveling.getTextRank(user.id, interaction.guildId!);
        const level = info.textLevel ?? 0;
        const experience = info.textExperience ?? 0;
        const requiredXP = container.utils.xp.textExperienceFormula(level + 1);
        const formattedRank = container.utils.numbers.format(rank ?? 0);

        const userInfo = {
            userId: user.id,
            username: user.username,
            displayAvatarURL: (options: { extension: AvatarExtension; size: 512 }) => user.displayAvatarURL(options),
            level: level,
            experience: experience,
            displayName: user.displayName,
        };
        const buffer = new RankCardBuilder()
            .setExperience(experience)
            .setAvatarURL(user.displayAvatarURL({ extension: 'jpg', size: 512 }))
            .setUser(userInfo)
            .setGuildId(interaction.guildId!)
            .setRequiredXP(requiredXP)
            .setRank(formattedRank)
        const rankCard = await buffer.build();

        await interaction.editReply({
            content: await resolveKey(interaction, `commands/replies/level:text_card`, { emoji: Emojis.SUCCESS, user: user.displayName }),
            components: [VoiceRankButtonRow],
            files: [{ attachment: rankCard, name: 'rank.png' }]
        });
    }
}
