import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { InteractionResponse, Message } from "discord.js";
import { container } from "@sapphire/pieces";

export class VoiceGhostCommand {
    public static async messageRun(message: Message) {
        await message.channel.sendTyping();
        const member = message.member;
        const channel = member!.voice.channel;
        const users_current_permissions = channel!.permissionOverwrites.resolve(channel!.guild.roles.everyone.id);

        try {
            await channel!.permissionOverwrites.edit(channel!.guild.roles.everyone, {
                ...users_current_permissions,
                ViewChannel: false,
            });
        } catch (error) {
            container.console.error(error)
            return message.reply({
                content: (await resolveKey(message, `commands/replies/error:error`)),
            });
        }
        return message.reply({
            content: (await resolveKey(message, `commands/replies/voice:ghost_success`, { emoji: Emojis.SUCCESS })),
        });
    }
    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const user = interaction.user.id;
        const member = interaction.guild!.members.resolve(user);
        const channel = member!.voice.channel;
        const users_current_permissions = channel!.permissionOverwrites.resolve(channel!.guild.roles.everyone.id);

        try {
            await channel!.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
                ...users_current_permissions,
                ViewChannel: false,
            });
        } catch (error) {
            container.console.error(error)
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/error:error`)),
                ephemeral: true,
            });
        }
        return interaction.reply({
            content: (await resolveKey(interaction, `commands/replies/voice:ghost_success`, { emoji: Emojis.SUCCESS })),
        });

    }
}