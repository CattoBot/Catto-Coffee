import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { textExperienceFormula } from '../../lib/utils';
import { TextRankButtonRow } from '../../shared/bot/buttons/LevelingButtonts';
import { resolveKey } from '@sapphire/plugin-i18next';
import { CheckTextExperienceEnabled } from '../../lib/decorators/InteractionTextExpEnabled';
import { LeaderboardImageBuilder } from '../../lib/classes/LeaderboardCard';
import { LevelingHelper } from '../../lib/helpers/leveling.helper';
import { container } from '@sapphire/framework';

export class ButtonTextLeaderboardHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'text-lb') return this.none();
        return this.some();
    }

    @CheckTextExperienceEnabled
    public async run(interaction: ButtonInteraction) {
        try {
            await interaction.deferReply();

            const guild_leaderboard = await LevelingHelper.getTextLeaderboard(interaction.guildId!);
            if (guild_leaderboard.length === 0) {
                await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:lb_not_data`) });
                return;
            }

            const userId = interaction.user.id;
            const builder = new LeaderboardImageBuilder()
                .setGuildLeaderboard(guild_leaderboard)
                .setUserId(userId)
                .setBackground('../../../assets/img/Leader_TXT.png')
                .setExperienceFormula(textExperienceFormula)
                .setType('text');

            const buffer = await builder.build();
            if (buffer) {
                await interaction.editReply({ files: [{ attachment: buffer, name: 'leaderboard.png' }], components: [TextRankButtonRow] });
            } else {
                await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/level:lb_voice_user_not_data`) });
            }
        } catch (error) {
            container.logger.error(`Error in ButtonTextLeaderboardHandler: ${error}`);
            await interaction.editReply({ content: 'An error occurred while processing your request. Please try again later.' });
        }
    }
}
