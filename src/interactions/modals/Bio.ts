import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { InteractionResponse, ModalSubmitInteraction } from 'discord.js';
import { Emojis } from '../../shared/enum/Emojis';
import { resolveKey } from '@sapphire/plugin-i18next';

export class BiographyModalHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit
        });
    }

    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== 'modal-bio') return this.none();
        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction): Promise<InteractionResponse> {
        const bio = interaction.fields.getTextInputValue('text-bio');
        await this.container.prisma.users.update({
            where: { userId: interaction.user.id }, data: { aboutme: bio }
        })

        return await interaction.reply({
            content: (await resolveKey(interaction, 'commands/replies/set:bio_success', { emoji: Emojis.SUCCESS })),
        });
    }
}