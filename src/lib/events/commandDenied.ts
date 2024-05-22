import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "../../shared/enum/Emojis";
import { ChatInputCommandInteraction } from "discord.js";

export class ChatInputDeniedCommandHelper {
    public shouldBeSilent(context: unknown): boolean {
        return Reflect.get(Object(context), 'silent');
    }

    public hasRemainingTime(context: unknown): boolean {
        return Reflect.get(Object(context), 'remaining');
    }

    public async handleCooldownReply(interaction: ChatInputCommandInteraction, context: unknown) {
        const cooldownMessage = await this.getCooldownMessage(interaction, context);
        await interaction.reply({ content: cooldownMessage, allowedMentions: { users: [interaction.user.id], roles: [] }, ephemeral: true });
    }

    public async getCooldownMessage(interaction: ChatInputCommandInteraction, context: unknown): Promise<string> {
        const currentTime = Math.floor(Date.now() / 1000);
        const cooldownEnd = currentTime + Math.floor(Reflect.get(Object(context), 'remaining') / 1000);
        return await resolveKey(interaction, `commands/replies/commandDenied:command_denied`, { emoji: Emojis.ERROR, seconds: `<t:${cooldownEnd}:R>` });
    }

    public async handleReply(interaction: ChatInputCommandInteraction, content: string) {
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ content, embeds: [], components: [], allowedMentions: { users: [interaction.user.id], roles: [] } });
        } else {
            await interaction.reply({ content, embeds: [], components: [], allowedMentions: { users: [interaction.user.id], roles: [] }, ephemeral: true });
        }
    }
}