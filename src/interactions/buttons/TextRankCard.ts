import { container, InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { CheckTextExperienceEnabled } from '../../lib/decorators/InteractionTextExpEnabled';
import { experienceFormula, formatNumber } from '../../lib/utils';
import { VoiceRankButtonRow } from '../../shared/bot/buttons/LevelingButtonts';
import { DrawCanvas } from '../../lib/classes/Canvas';

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
    public async run(interaction: ButtonInteraction) {
        const user = interaction.user;
        if (user.bot) {
            await interaction.reply({ content: 'Bots cannot earn XP.', ephemeral: true });
            return;
        }
        const info = await this.getUserInfo(user.id, interaction.guildId!);
        if (!info) {
            await interaction.reply({ content: 'You have not earned any XP yet.', ephemeral: true });
            return;
        }

        const level = info.textLevel ?? 0;
        const experience = info.textExperience ?? 0;

        const rank = await this.getRank(user.id, interaction.guildId!);
        const requiredXP = experienceFormula(level + 1);
        const formattedRank = formatNumber(rank ?? 0);

        const avatarURL = user.displayAvatarURL({ extension: 'jpg', size: 128 });
        const buffer = await DrawCanvas.generateUserRankImage(
            {
                userId: user.id,
                username: user.username,
                displayAvatarURL: user.displayAvatarURL,
                textExperience: experience,
                level
            },
            interaction.guildId!,
            formattedRank,
            requiredXP,
            experience,
            avatarURL
        );

        await interaction.update({
            files: [{ attachment: buffer, name: 'rank.png' }],
            components: [VoiceRankButtonRow]
        });
    }

    public async getRank(userId: string, guildId: string) {
        const users = await container.prisma.textExperience.findMany({
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
    }

    private async getUserInfo(userId: string, guildId: string) {
        const user = await container.prisma.textExperience.findUnique({
            where: {
                guildId_userId: {
                    userId: userId,
                    guildId: guildId,
                }
            }
        })
        return user;
    }
}