import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { GuildMember, InteractionResponse, Message, PermissionFlagsBits } from "discord.js";

export class VoiceResetCommand {
    public static async messageRun(message: Message) {
        await message.channel.sendTyping();
        const member = message.member as GuildMember;
        const category = member.voice.channel!.parent;
        const channel_permissions = category!.permissionOverwrites.cache.map((overwrite) => {
            return {
                id: overwrite.id,
                allow: overwrite.allow.bitfield,
                deny: overwrite.deny.bitfield,
            };
        });

        const user_permissions = {
            id: member.id,
            allow: PermissionFlagsBits.Connect | PermissionFlagsBits.ViewChannel,
            deny: BigInt(0),
        }

        await member.voice.channel!.permissionOverwrites.set(channel_permissions.concat(user_permissions))

        return message.reply({
            content: (await resolveKey(message, `commands/replies/voice:reset_success`, { emoji: Emojis.SUCCESS })),
        });
    }
    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const user = interaction.user.id;
        const member = interaction.guild!.members.resolve(user) as GuildMember;

        const category = member.voice.channel!.parent;
        const channel_permissions = category!.permissionOverwrites.cache.map((overwrite) => {
            return {
                id: overwrite.id,
                allow: overwrite.allow.bitfield,
                deny: overwrite.deny.bitfield,
            };
        });

        const user_permissions = {
            id: user,
            allow: PermissionFlagsBits.Connect | PermissionFlagsBits.ViewChannel,
            deny: BigInt(0),
        }

        await member.voice.channel!.permissionOverwrites.set(channel_permissions.concat(user_permissions))

        return interaction.reply({
            content: (await resolveKey(interaction, `commands/replies/voice:reset_success`, { emoji: Emojis.SUCCESS })),
        });

    }
}