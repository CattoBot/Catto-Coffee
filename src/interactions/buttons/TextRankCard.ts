import { container, InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { CheckTextExperienceEnabled } from '../../lib/decorators/InteractionTextExpEnabled';
import { VoiceRankButtonRow } from '../../shared/bot/buttons/LevelingButtonts';
import { ButtonCooldown } from '../../lib/decorators/HandlersCooldown';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Emojis } from '../../shared/enum/Emojis';
import { RankCardBuilder } from '../../lib/classes/RankCard';

export class ButtonTextRankHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'txt-rank') return this.none();
        return this.some();
    }

    @CheckTextExperienceEnabled
    @ButtonCooldown(60)
    public async run(interaction: ButtonInteraction) {
        try {
            await interaction.deferReply({ ephemeral: false });
            const user = interaction.user;
            if (user.bot) {
                await interaction.editReply({ content: 'Bots cannot earn XP.' });
                return;
            }
            const info = await this.getUserInfo(user.id, interaction.guildId!);
            if (!info) {
                await interaction.editReply({ content: 'You have not earned any XP yet.' });
                return;
            }

            const level = info.textLevel ?? 0;
            const experience = info.textExperience ?? 0;
            const rank = await this.getRank(user.id, interaction.guildId!);
            const requiredXP = container.utils.xp.textExperienceFormula(level + 1);
            const formattedRank = container.utils.numbers.format(rank ?? 0);
            const avatarURL = user.displayAvatarURL({ extension: 'jpg', size: 512 });

            const userInfo = {
                userId: user.id,
                username: user.username,
                displayAvatarURL: (_options: { extension: string; size: number }) => user.displayAvatarURL({ extension: "jpg", size: 512 }),
                level: level,
                experience: experience,
                displayName: user.displayName,
            }

            const buffer = await new RankCardBuilder()
                .setExperience(experience)
                .setAvatarURL(avatarURL)
                .setRank(formattedRank)
                .setRequiredXP(requiredXP)
                .setGuildId(interaction.guildId!)
                .setUser(userInfo)
                .build();

            await interaction.editReply({
                content: await resolveKey(interaction, `commands/replies/level:text_card`, { emoji: Emojis.SUCCESS, user: user.displayName }),
                files: [{ attachment: buffer, name: 'rank.png' }],
                components: [VoiceRankButtonRow]
            });
        } catch (error) {
            container.logger.error(`Error in ButtonTextRankHandler: ${error}`);
            await interaction.editReply({ content: 'An error occurred while processing your request. Please try again.' });
        }
    }

    public async getRank(userId: string, guildId: string) {
        try {
            const users = await container.prisma.text_experience.findMany({
                where: { guildId },
                orderBy: [
                    {
                        textLevel: 'desc'
                    },
                    {
                        textExperience: 'desc'
                    }
                ]
            });
            const userIndex = users.findIndex((user) => user.userId === userId);
            if (userIndex === -1) return null;
            return userIndex + 1;
        } catch (error) {
            container.logger.error(`Error in getRank: ${error}`);
            return null;
        }
    }

    private async getUserInfo(userId: string, guildId: string) {
        try {
            const user = await container.prisma.text_experience.findUnique({
                where: {
                    guildId_userId: {
                        userId: userId,
                        guildId: guildId,
                    }
                }
            });
            return user;
        } catch (error) {
            container.logger.error(`Error in getUserInfo: ${error}`);
            return null;
        }
    }
}
