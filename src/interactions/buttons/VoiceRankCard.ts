import { container, InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { CheckVoiceExperienceEnabled } from '../../lib/decorators/InteractionVoiceExpEnabled';
import { DrawCanvas } from '../../lib/classes/Canvas';
import { experienceFormula, formatNumber } from '../../lib/utils';
import { TextRankButtonRow } from '../../shared/bot/buttons/LevelingButtonts';

export class ButtonVoiceRankHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'vc-rank') return this.none();
        return this.some();
    }

    @CheckVoiceExperienceEnabled
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
        
        const level = info.voiceLevel ?? 0;
        const experience = info.voiceExperience ?? 0;

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
            interaction.guild?.id!,
            formattedRank,
            requiredXP,
            experience,
            avatarURL
        );

        await interaction.update({
            files: [{ attachment: buffer, name: 'rank.png' }],
            components: [TextRankButtonRow]
        });
    }

    public async getRank(userId: string, guildId: string) {
        const users = await container.prisma.voiceExperience.findMany({
            where: { guildId },
            orderBy: [
                {
                    voiceLevel: 'desc'
                },
                {
                    voiceExperience: 'desc'
                }
            ]
        });

        const userIndex = users.findIndex((user) => user.userId === userId);
        if (userIndex === -1) return null;
        return userIndex + 1;
    }

    private async getUserInfo(userId: string, guildId: string) {
        return await container.prisma.voiceExperience.findUnique({
            where: {
                guildId_userId: {
                    userId,
                    guildId
                }
            }
        });
    }
}
