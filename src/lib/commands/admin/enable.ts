import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";

export class EnableCommand {
    public static async commandRun(interaction: Subcommand.ChatInputCommandInteraction) {
        const command = interaction.options.getString('command', true)
        const disabledCommand = await container.prisma.disabledCommands.findUnique({
            where: {
                guildId_command: {
                    guildId: interaction.guild!.id,
                    command: command
                }
            }
        })

        if (!disabledCommand) return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:already_enabled_command`, { emoji: Emojis.ERROR }), ephemeral: true });

        await container.prisma.disabledCommands.delete({
            where: {
                guildId_command: {
                    guildId: interaction.guild!.id,
                    command: command
                }
            }
        })

        return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/admin:enable_command`, { command: command, emoji: Emojis.SUCCESS }), ephemeral: false });
    }

    public static async moduleRun(interaction: Subcommand.ChatInputCommandInteraction) {
        const module = interaction.options.getString('module', true)
        const disabledModule = await container.prisma.disabledModules.findUnique({
            where: {
                guildId_module: {
                    guildId: interaction.guild!.id,
                    module: module
                }
            }
        })

        if (!disabledModule) return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:already_enabled_module`, { emoji: Emojis.ERROR }), ephemeral: true });

        await container.prisma.disabledModules.delete({
            where: {
                guildId_module: {
                    guildId: interaction.guild!.id,
                    module: module
                }
            }
        })

        return await interaction.reply({ content: await resolveKey(interaction, `commands/replies/admin:enable_module`, { module: module, emoji: Emojis.SUCCESS }), ephemeral: false });
    }
}