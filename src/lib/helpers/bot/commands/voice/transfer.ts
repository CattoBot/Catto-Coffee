import { fetchT, resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { GuildMember, InteractionResponse } from "discord.js";
import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { logger, ServerLogger } from "@lib/helpers/misc/logger.helper";

export class VoiceTransferCommand {
    private static prisma: PrismaCoreModule = Prisma;
    private static logger: ServerLogger = logger;
    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const translateKey = await fetchT(interaction);
        const user = interaction.options.getUser(translateKey('commands/options/voice:reject_name'));
        const member = interaction.guild.members.resolve(user.id) as GuildMember;

        try {
            await this.prisma.voices.update({
                where: {
                    guildId_channelId: {
                        channelId: member.voice.channel.id,
                        guildId: interaction.guild.id
                    }
                }, data: {
                    channelOwnerId: member.id
                }
            })
        } catch (error) {
            this.logger.error(error);
            return interaction.reply({ content: (await resolveKey(interaction, 'commands/replies/error:error', { user: user.displayName, emoji: Emojis.ERROR })), ephemeral: true });
        }


        return await interaction.reply({ content: (await resolveKey(interaction, `commands/replies/voice:transfer_success`, { user: user.displayName, emoji: Emojis.SUCCESS })), });
    }
}
