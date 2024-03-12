import { fetchT } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { GuildMember, InteractionResponse } from "discord.js";
import { Prisma } from "@lib/database/prisma";
import { ServerLogger } from "@lib/helpers/misc/logger.helper";

export class VoiceTransferCommand {
    private static prisma: Prisma = new Prisma();
    private static logger: ServerLogger = new ServerLogger();
    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const translateKey = await fetchT(interaction);
        const user = interaction.options.getUser(translateKey('commands/options/voice:reject_name'));
        const member = interaction.guild.members.resolve(user.id) as GuildMember;

        try {
            await this.prisma.activeTempVoice.update({
                where: {
                    id_guildId: {
                        id: member.voice.channel.id,
                        guildId: interaction.guild.id
                    }
                }, data: {
                    channelOwner: member.id
                }
            })
        } catch (error) {
            this.logger.error(error);
            return interaction.reply({ content: translateKey('commands/replies/error:error', { user: user.displayName, emoji: Emojis.ERROR }), ephemeral: true });
        }


        return interaction.reply({ content: translateKey('commands/replies/voice:transfer_success', { user: user.displayName, emoji: Emojis.SUCCESS }) });
    }
}
