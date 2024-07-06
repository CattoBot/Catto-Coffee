import { container, InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { CheckVoiceExperienceEnabled } from '../../lib/decorators/InteractionVoiceExpEnabled';
import { TextRankButtonRow } from '../../shared/bot/buttons/LevelingButtonts';
import { ButtonCooldown } from '../../lib/decorators/HandlersCooldown';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Emojis } from '../../shared/enum/Emojis';
import { RankCardBuilder } from '../../lib/classes/RankCard';

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
    @ButtonCooldown(60)
    public async run(interaction: ButtonInteraction) {
        container.utils.canvas.registeringFONT();
        await interaction.deferReply();
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

        const level = info.voiceLevel ?? 0;
        const experience = info.voiceExperience ?? 0;

        const rank = await this.getRank(user.id, interaction.guildId!);
        const requiredXP = container.utils.xp.experienceFormula(level + 1);
        const formattedRank = container.utils.numbers.format(rank ?? 0);

        const avatarURL = user.displayAvatarURL({ extension: 'jpg', size: 128 });

        const userInfo = {
            userId: user.id,
            username: user.username,
            displayAvatarURL: (_options: { extension: string; size: number }) => user.displayAvatarURL({ extension: "jpg", size: 128 }),
            level: level,
            experience: experience,
            displayName: user.displayName,
        }

        const buffer = new RankCardBuilder()
            .setAvatarURL(avatarURL)
            .setExperience(experience)
            .setRank(formattedRank)
            .setRequiredXP(requiredXP)
            .setUser(userInfo)
            .setGuildId(interaction.guildId!)
            .build();

        await interaction.editReply({
            content: await resolveKey(interaction, `commands/replies/level:voice_card`, { emoji: Emojis.SUCCESS, user: user.displayName }),
            files: [{ attachment: await buffer, name: 'rank.png' }],
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
        return await container.prisma.voice_experience.findUnique({
            where: {
                guildId_userId: {
                    userId,
                    guildId
                }
            }
        });
    }
}
