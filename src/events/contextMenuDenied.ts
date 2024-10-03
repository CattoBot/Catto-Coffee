import { resolveKey } from "@sapphire/plugin-i18next";
import { EMOJIS } from "../lib/enum";
import { ContextMenuCommandInteraction } from "discord.js";

export class ContextMenuCommandDeniedHelper {
    public shouldBeSilent(context: unknown): boolean {
        return Reflect.get(Object(context), 'silent');
    }

    public hasRemainingTime(context: unknown): boolean {
        return Reflect.get(Object(context), 'remaining');
    }

    public async handleCooldownReply(interaction: ContextMenuCommandInteraction, context: unknown) {
        const cooldownMessage = await this.getCooldownMessage(interaction, context);
        await interaction.reply({
            content: cooldownMessage, allowedMentions: { users: [interaction.user.id], roles: [] }, ephemeral: true
        });
    }

    public async getCooldownMessage(interaction: ContextMenuCommandInteraction, context: unknown): Promise<string> {
        const currentTime = Math.floor(Date.now() / 1000);
        const cooldownEnd = currentTime + Math.floor(Reflect.get(Object(context), 'remaining') / 1000);
        return resolveKey(interaction, `commands/replies/commandDenied:command_denied`, {
            emoji: EMOJIS.ERROR, seconds: `<t:${cooldownEnd}:R>`
        });
    }

    public async handleReply(interaction: ContextMenuCommandInteraction, content: string) {
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({
                content, embeds: [], components: [], allowedMentions: { users: [interaction.user.id], roles: [] }
            });
        } else {
            await interaction.reply({
                content, embeds: [], components: [], allowedMentions: { users: [interaction.user.id], roles: [] }, ephemeral: true
            });
        }
    }
}