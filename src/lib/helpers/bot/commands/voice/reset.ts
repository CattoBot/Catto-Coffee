import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { GuildMember, InteractionResponse, PermissionFlagsBits } from "discord.js";

export class VoiceResetCommand {

    public static async run(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const user = interaction.user.id;
        const member = interaction.guild.members.resolve(user) as GuildMember;

        const category = member.voice.channel.parent;
        const channel_permissions = category.permissionOverwrites.cache.map((overwrite) => {
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

        await member.voice.channel.permissionOverwrites.set(channel_permissions.concat(user_permissions))

        return interaction.reply({
            content: (await resolveKey(interaction, `commands/replies/voice:reset_success`, { emoji: Emojis.SUCCESS })),
        });

    }
}