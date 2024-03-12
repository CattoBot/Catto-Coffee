import { CommandInteraction, InteractionResponse } from "discord.js";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "@shared/enum/misc/emojis.enum";

export async function CheckSelfVoiceCommandInteraction(interaction: CommandInteraction, user_id: string, target_user_id: string): Promise<InteractionResponse> {
    if (user_id === target_user_id) {
        return interaction.reply({ content: (await resolveKey(interaction, 'commands/replies/commandDenied:self_voice_command', { emoji: Emojis.ERROR })), ephemeral: true });
    }
}