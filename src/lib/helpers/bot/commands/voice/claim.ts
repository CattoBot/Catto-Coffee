import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { InteractionResponse } from "discord.js";

export class VoiceClaimCommand {
    private static prisma: PrismaCoreModule = Prisma;

    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const user = interaction.user.id;
        const member = interaction.guild.members.resolve(user);
        const channel = await this.find(member.voice.channel.id, interaction.guild?.id);

        if (channel.channelOwnerId === member.id) {
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/commandDenied:already_owner`, { emoji: Emojis.ERROR })),
                ephemeral: true,
            });
        }

        if (member.voice.channel.members.has(channel.channelOwnerId)) {
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/voice:claim_error`, { emoji: Emojis.ERROR })),
                ephemeral: true,
            });
        } else {
            await this.prisma.voices.update({
                where: {
                    guildId_channelId: {
                        channelId: interaction.guild?.id,
                        guildId: member.voice.channel.id,
                    },
                },
                data: {
                    channelOwnerId: member.id,
                },
            });

            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/voice:claim_success`, { emoji: Emojis.SUCCESS })),
                ephemeral: true
            });
        }
    }

    private static async find(channel_id: string, guild_id: string) {
        const channel = await this.prisma.voices.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guild_id,
                    channelId: channel_id
                }
            },
        });

        return channel;
    }
}