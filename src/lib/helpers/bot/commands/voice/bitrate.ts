import { logger, ServerLogger } from "@lib/helpers/misc/logger.helper";
import { fetchT, resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { GuildMember, InteractionResponse } from "discord.js";
import { ConvertBitrateToMillions } from "@shared/functions/bitrate.funct";

export class VoiceBitrateCommand {
    private static logger: ServerLogger = logger;
    private static translateKey = fetchT;

    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const bitrate = interaction.options.getInteger((await this.translateKey(interaction))('commands/options/voice:bitrate_name'));
        const member = interaction.guild.members.resolve(interaction.user.id) as GuildMember;

        try {
            await member.voice.channel.edit({
                bitrate: ConvertBitrateToMillions(bitrate)
            })
        } catch (error) {
            this.logger.error(error)
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/error:error`)),
                ephemeral: true,
            });
        }
        return interaction.reply({
            content: (await resolveKey(interaction, `commands/replies/voice:bitrate_success`, { emoji: Emojis.SUCCESS, bitrate: bitrate })),
            ephemeral: true
        });
    }
}