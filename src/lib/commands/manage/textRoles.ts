import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";

export class TextRoleCommands {
    public static async add(interaction: Subcommand.ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role', true);
        const level = interaction.options.getInteger('level', true);
        if (!role) return interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:invalid_role`), ephemeral: true });

        await container.prisma.experience_role_rewards.create({
            data: {
                guildId: interaction.guild!.id,
                roleId: role.id,
                roleType: 'text',
                level: level
            }
        })

        return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/admin:text_role_add`, { role: role, emoji: Emojis.SUCCESS }), ephemeral: true });
    }

    public static async remove(interaction: Subcommand.ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role', true);
        if (!role) return interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:invalid_role`), ephemeral: true });

        await container.prisma.experience_role_rewards.delete({
            where: {
                guildId_roleId_roleType: {
                    guildId: interaction.guild!.id,
                    roleId: role.id,
                    roleType: 'voice'
                }
            }
        })
        await container.redis.del(`textExperienceRoles:${interaction.guild!.id}`);
        return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/admin:text_role_remove`, { role: role, emoji: Emojis.SUCCESS }), ephemeral: false });
    }
}