import { ServerLogger } from "@lib/helpers/misc/logger.helper";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { InteractionResponse } from "discord.js";

export class VoiceUnlockCommand {
    private static logger: ServerLogger = new ServerLogger();

    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const user = interaction.user.id;
        const member = interaction.guild.members.resolve(user);
        const channel = member.voice.channel;
        const users_current_permissions = channel.permissionOverwrites.resolve(channel.guild.roles.everyone.id);

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                ...users_current_permissions,
                Connect: true
            });
        } catch (error) {
            this.logger.error(error)
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/error:error`)),
                ephemeral: true,
            });
        }
        return interaction.reply({
            content: (await resolveKey(interaction, `commands/replies/voice:unlock_success`, { emoji: Emojis.SUCCESS })),
        });

    }
}