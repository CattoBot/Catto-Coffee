import { fetchT, resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { GuildMember, InteractionResponse, Message } from "discord.js";
import { container } from "@sapphire/pieces";
import { Args } from "@sapphire/framework";

export class VoiceLimitCommand {
    public static async messageRun(message: Message, args: Args) {
        await message.channel.sendTyping();
        try {
            const limit = await args.pick('integer');
            if (!limit) return message.reply('Please provide a valid limit for the voice channel.');

            if (limit < 0 || limit > 99) {
                return message.reply('Please provide a limit between 0 and 99.');
            }

            const member = message.member as GuildMember;
            const channel = member.voice.channel;

            try {
                await channel!.setUserLimit(limit);
                return message.reply({
                    content: await resolveKey(message, 'commands/replies/voice:limit_success', { emoji: Emojis.SUCCESS, limit: limit }),
                });
            } catch (error) {
                console.error('Error setting user limit:', error);
                return message.reply({
                    content: await resolveKey(message, 'commands/replies/error:error'),
                });
            }
        } catch {
            return message.reply('Please provide a valid limit for the voice channel.');
        }
    }

    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {

        const translateKey = await fetchT(interaction);
        const limit = interaction.options.getInteger(translateKey('commands/options/voice:limit_name'), true);
        const member = interaction.guild!.members.resolve(interaction.user.id);
        const channel = member!.voice.channel;

        if (limit < 0 || limit > 99) {
            return interaction.reply({
                content: 'Please provide a limit between 0 and 99.',
                ephemeral: true
            });
        }

        try {
            await channel!.setUserLimit(limit)
        } catch (error) {
            container.console.error(error)
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/error:error`)),
                ephemeral: true,
            });
        }

        await this.updateLimit(limit, member!);
        return interaction.reply({
            content: (await resolveKey(interaction, `commands/replies/voice:limit_success`, { emoji: Emojis.SUCCESS, limit: limit })),
        });
    }

    private static async updateLimit(limit: number, member: GuildMember) {
        await container.prisma.i_users_temp_voice.upsert({
            where: {
                userId: member.id
            }, update: {
                channelLimit: limit
            }, create: {
                userId: member.id,
                channelLimit: limit
            }
        })
    }
}