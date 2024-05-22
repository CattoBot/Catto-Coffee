import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";

export class DisableCommand {
    public static async commandRun(interaction: Subcommand.ChatInputCommandInteraction) {
        const command = interaction.options.getString('command', true);

        // Debugging information
        console.log(`Disabling command: ${command} for guild: ${interaction.guild!.id}`);

        const disabledCommand = await container.prisma.disabledCommands.findUnique({
            where: {
                guildId_command: {
                    guildId: interaction.guild!.id,
                    command: command,
                },
            },
        });

        // More debugging information
        console.log(`Disabled command entry found: ${!!disabledCommand}`);

        if (disabledCommand) {
            return await interaction.reply({
                content: await resolveKey(interaction, `commands/replies/error:already_disabled_command`, { emoji: Emojis.ERROR }),
                ephemeral: true,
            });
        }

        await container.prisma.disabledCommands.create({
            data: {
                guildId: interaction.guild!.id,
                command: command,
            },
        });

        return await interaction.reply({
            content: await resolveKey(interaction, `commands/replies/admin:disable_command`, { command: command, emoji: Emojis.SUCCESS }),
            ephemeral: false,
        });
    }

    public static async moduleRun(interaction: Subcommand.ChatInputCommandInteraction) {
        const module = interaction.options.getString('module', true);

        // Debugging information
        console.log(`Disabling module: ${module} for guild: ${interaction.guild!.id}`);

        const disabledModule = await container.prisma.disabledModules.findUnique({
            where: {
                guildId_module: {
                    guildId: interaction.guild!.id,
                    module: module,
                },
            },
        });

        // More debugging information
        console.log(`Disabled module entry found: ${!!disabledModule}`);

        if (disabledModule) {
            return await interaction.reply({
                content: await resolveKey(interaction, `commands/replies/error:already_disabled_module`, { emoji: Emojis.ERROR }),
                ephemeral: true,
            });
        }

        await container.prisma.disabledModules.create({
            data: {
                guildId: interaction.guild!.id,
                module: module,
            },
        });

        return await interaction.reply({
            content: await resolveKey(interaction, `commands/replies/admin:disable_module`, { module: module, emoji: Emojis.SUCCESS }),
            ephemeral: false,
        });
    }
}
