import { ServerLogger } from "@lib/helpers/misc/logger.helper";
import { fetchT, resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { InteractionResponse } from "discord.js";

export class VoiceLimitCommand {
    private static logger: ServerLogger = new ServerLogger();

    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {

        const translateKey = await fetchT(interaction);
        const limit = interaction.options.getInteger(translateKey('commands/options/voice:limit_name'));
        const member = interaction.guild.members.resolve(interaction.user.id);
        const channel = member.voice.channel;

        try {
            await channel.setUserLimit(limit)
        } catch (error) {
            this.logger.error(error)
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/error:error`)),
                ephemeral: true,
            });
        }
        return interaction.reply({
            content: (await resolveKey(interaction, `commands/replies/voice:limit_success`, { emoji: Emojis.SUCCESS, limit: limit })),
        });
    }
}