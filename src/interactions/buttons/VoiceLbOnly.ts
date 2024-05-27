import { container, InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { DrawCanvas } from '../../lib/classes/Canvas';
import { CheckVoiceExperienceEnabled } from '../../lib/decorators/InteractionVoiceExpEnabled';
import { experienceFormula, formatNumber, registeringFONT } from '../../lib/utils';
import { TextRankButtonRow } from '../../shared/bot/buttons/LevelingButtonts';
import { ButtonCooldown } from '../../lib/decorators/HandlersCooldown';

export class ButtonVoiceRankOnlyHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'vc-only-rank') return this.none();
        return this.some();
    }

    @CheckVoiceExperienceEnabled
    @ButtonCooldown(60)
    public async run(interaction: ButtonInteraction) {
        registeringFONT();
        await interaction.deferReply();
        const user = interaction.user;
        if (user.bot) {
            await interaction.editReply({ content: 'Bots cannot earn XP.' });
            return;
        }

        const info = await this.getUserInfo(user.id, interaction.guildId!);
        if (!info) {
            await interaction.reply({ content: 'You have not earned any XP yet.' });
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
                username: user.displayName,
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

        await interaction.editReply({
            files: [{ attachment: buffer, name: 'rank.png' }],
            components: [TextRankButtonRow]
        });
    }

    public async getRank(userId: string, guildId: string) {
        const users = await container.prisma.voice_experience.findMany({
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
        const user = await container.prisma.voice_experience.findUnique({
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