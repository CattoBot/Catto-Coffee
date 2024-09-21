import { fetchT, resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { GuildMember, InteractionResponse, Message } from "discord.js";
import { container } from "@sapphire/pieces";
import { Args } from "@sapphire/framework";

export class VoiceBitrateCommand {
    private static translateKey = fetchT;

    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const bitrate = interaction.options.getInteger((await this.translateKey(interaction))('commands/options/voice:bitrate_name'));
        const member = interaction.guild!.members.resolve(interaction.user.id) as GuildMember;

        try {
            if (member.voice.channel) {
                await member.voice.channel.edit({
                    bitrate: container.utils.ConvertBitrateToMillions(bitrate ?? 64)
                });
            } else {
                throw new Error('Member is not in a voice channel.');
            }
        } catch (error) {
            container.console.error(error);
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

    public static async messageRun(message: Message, args: Args): Promise<void> {
        if (message.channel.isSendable())
            await message.channel.sendTyping();
        const bitrate = await args.pick('integer').catch(() => null);
        if (!bitrate) {
            await message.reply({
                content: (await resolveKey(message, `commands/replies/voice:bitrate_not_provided`))
            });
            return;
        }
        if (bitrate && (bitrate < 8 || bitrate > 96)) {
            await message.reply({
                content: (await resolveKey(message, `commands/replies/voice:bitrate_not_provided`))
            });
        }
        const member = message.guild!.members.resolve(message.author.id) as GuildMember;

        try {
            if (member.voice.channel) {
                const actualBitrate = bitrate ?? 64;
                await member.voice.channel.edit({
                    bitrate: container.utils.ConvertBitrateToMillions(actualBitrate)
                });
            }
            await message.reply({
                content: (await resolveKey(message, `commands/replies/voice:bitrate_success`, { emoji: Emojis.SUCCESS, bitrate: bitrate }))
            });

        } catch (error) {
            container.console.error(error);
            await message.reply({
                content: (await resolveKey(message, `commands/replies/error:error`))
            });
            return;
        }
    }
}