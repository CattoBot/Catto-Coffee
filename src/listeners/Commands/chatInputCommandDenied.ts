import { Events, Listener, ChatInputCommandDeniedPayload, UserError } from '@sapphire/framework';
import { Emojis } from '@shared/enum/misc/emojis.enum';
import { resolveKey } from '@sapphire/plugin-i18next';

export class ChatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
    public async run(error: UserError, { interaction, context }: ChatInputCommandDeniedPayload) {
        if (!context?.silent) {
            if (context?.remaining) {
                const seconds = Math.floor(context?.remaining as number / 1000);
                const plural = seconds > 1 ? 's' : '';

                return interaction.reply({
                    content: (await resolveKey(interaction, 'commands/replies/commandDenied:command_deied', { emoji: Emojis.ERROR, seconds: seconds, plural: plural })),
                    allowedMentions: { users: [interaction.user.id], roles: [] },
                    ephemeral: true
                });
            }

            return interaction.reply({
                content: error.message, embeds: [], components: [], allowedMentions: { users: [interaction.user.id], roles: [] }, ephemeral: true
            });
        }
    }
}
