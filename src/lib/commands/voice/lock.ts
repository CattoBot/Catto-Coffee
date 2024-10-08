import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { GuildMember, InteractionResponse, Message } from "discord.js";

export class VoiceLockCommand {

    public static async messageRun(message: Message) {
        if (message.channel.isSendable())
            await message.channel.sendTyping();
        const member = message.member;
        const channel = member!.voice.channel;
        const users_current_permissions = channel!.permissionOverwrites.resolve(channel!.guild.roles.everyone.id);

        try {
            await channel!.permissionOverwrites.edit(channel!.guild.roles.everyone, {
                ...users_current_permissions,
                Connect: false
            });
        } catch (error) {
            container.console.error(error)
            return message.reply({
                content: (await resolveKey(message, `commands/replies/error:error`)),
            });
        }
        return message.reply({
            content: (await resolveKey(message, `commands/replies/voice:lock_success`, { emoji: Emojis.SUCCESS })),
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
                Connect: false
            });
        } catch (error) {
            container.console.error(error)
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/error:error`)),
                ephemeral: true,
            });
        }

        await this.updateLock(member!);
        return interaction.reply({
            content: (await resolveKey(interaction, `commands/replies/voice:lock_success`, { emoji: Emojis.SUCCESS })),
        });
    }

    private static async updateLock(member: GuildMember) {
        await container.prisma.i_users_temp_voice.upsert({
            where: {
                userId: member.id
            }, update: {
                isLocked: true
            }, create: {
                userId: member.id,
                isLocked: true
            }
        })
    }
}