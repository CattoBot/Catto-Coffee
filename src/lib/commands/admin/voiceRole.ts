import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";

export class VoiceRoleCommands {
    public static async add(interaction: Subcommand.ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role', true);
        const level = interaction.options.getInteger('level', true);
        if (!role) {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:invalid_role'), ephemeral: true });
        }

        const existingRole = await container.prisma.experienceRoleRewards.findFirst({
            where: {
                guildId: interaction.guild!.id,
                roleId: role.id,
                roleType: 'voice'
            }
        });

        if (existingRole) {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:voice_role_already_exists'), ephemeral: true });
        }

        await container.prisma.experienceRoleRewards.create({
            data: {
                guildId: interaction.guild!.id,
                roleId: role.id,
                roleType: 'voice',
                level: level
            }
        });

        return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/admin:voice_role_add', { role: role, emoji: Emojis.SUCCESS }), ephemeral: false });
    }

    public static async remove(interaction: Subcommand.ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role', true);
        if (!role) {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:invalid_role'), ephemeral: true });
        }

        const existingRole = await container.prisma.experienceRoleRewards.findFirst({
            where: {
                guildId: interaction.guild!.id,
                roleId: role.id,
                roleType: 'voice'
            }
        });

        if (!existingRole) {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:voice_role_not_exists'), ephemeral: true });
        }

        await container.prisma.experienceRoleRewards.delete({
            where: {
                guildId_roleId_roleType: {
                    guildId: interaction.guild!.id,
                    roleId: role.id,
                    roleType: 'voice'
                }
            }
        });

        return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/admin:voice_role_remove', { role: role, emoji: Emojis.SUCCESS }), ephemeral: false });
    }
}
