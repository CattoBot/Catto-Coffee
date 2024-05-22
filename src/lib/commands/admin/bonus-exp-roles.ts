import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";

export class BonusVoiceRolesCommand {
    public static async add(interaction: Subcommand.ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role', true);
        const module = interaction.options.getString('module', true);

        const roleExists = await BonusVoiceRolesCommand.roleExists(interaction.guild!.id, role.id, module);
        if (roleExists) {
            return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:already_bonus_role`), ephemeral: true });
        }

        const result = await BonusVoiceRolesCommand.addRoleToModule(interaction.guild!.id, role.id, module);
        if (result) {
            return await interaction.reply({
                content: await resolveKey(interaction, `commands/replies/admin:${module.toLowerCase()}_bonus_role_add`, { role: `${role}`, emoji: Emojis.SUCCESS }),
                ephemeral: false
            });
        }

        return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:invalid_module`), ephemeral: true });
    }

    public static async remove(interaction: Subcommand.ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role', true);
        const module = interaction.options.getString('module', true);
        const roleExists = await BonusVoiceRolesCommand.roleExists(interaction.guild!.id, role.id, module);

        if (!roleExists) {
            return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:invalid_bonus_role`), ephemeral: true });
        }

        const result = await BonusVoiceRolesCommand.removeRoleFromModule(interaction.guild!.id, role.id, module);
        if(result){
            return await interaction.reply({
                content: await resolveKey(interaction, `commands/replies/admin:${module.toLowerCase()}_bonus_role_remove`, { role: role, emoji: Emojis.SUCCESS }),
                ephemeral: false
            });
        }

        return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:invalid_module`), ephemeral: true });
    }

    private static async roleExists(guildId: string, roleId: string, module: string): Promise<boolean> {
        const model = BonusVoiceRolesCommand.getModel(module);
        if (!model) return false;

        const roledb = await (container.prisma[model] as any).findUnique({
            where: {
                guildId_roleId: {
                    guildId,
                    roleId
                }
            }
        });

        return !!roledb;
    }

    private static async addRoleToModule(guildId: string, roleId: string, module: string): Promise<boolean> {
        const model = BonusVoiceRolesCommand.getModel(module);
        if (!model) return false;

        await (container.prisma[model] as any).create({
            data: {
                guildId,
                roleId
            }
        });

        return true;
    }

    private static async removeRoleFromModule(guildId: string, roleId: string, module: string): Promise<boolean> {
        const model = BonusVoiceRolesCommand.getModel(module);
        if (!model) return false;

        await (container.prisma[model] as any).deleteMany({
            where: {
                guildId: guildId,
                roleId: roleId
            }
        });

        return true;
    }

    private static getModel(module: string) {
        switch (module) {
            case 'Voice':
                return 'bonusVoiceRoles';
            case 'Text':
                return 'bonusTextRoles';
            default:
                return null;
        }
    }
}
