import { ApplyOptions, RequiresClientPermissions, RequiresUserPermissions } from "@sapphire/decorators";
import { Subcommand, SubcommandOptions } from "@sapphire/plugin-subcommands";
import { SetCommandOptions } from "../../shared/bot/commands/options/SubCommands/set";
import { SetSubcommands } from "../../shared/bot/commands/build/set";
import { BioModalHandler } from "../../shared/bot/modals/bio";
import { SetLevelCommand } from "../../lib/commands/set/set-level";
import { PermissionFlagsBits } from "discord.js";

@ApplyOptions<SubcommandOptions>(SetCommandOptions.Options)
export class SetProfileCommands extends Subcommand {
    constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, { ...options });
    }

    override registerApplicationCommands(registry: Subcommand.Registry) {
        SetSubcommands.registerCommands(registry);
    }
    public async chatInputBioName(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.showModal(BioModalHandler)
    }
    @RequiresClientPermissions(PermissionFlagsBits.ManageRoles)
    @RequiresUserPermissions(PermissionFlagsBits.ManageRoles)
    public async chatInputLevelSetText(interaction: Subcommand.ChatInputCommandInteraction) {
        return SetLevelCommand.chatInputText(interaction);
    }
    @RequiresClientPermissions(PermissionFlagsBits.ManageRoles)
    @RequiresUserPermissions(PermissionFlagsBits.ManageRoles)
    public async chatInputLevelSetVoice(interaction: Subcommand.ChatInputCommandInteraction) {
        return SetLevelCommand.chatInputVoice(interaction);
    }
}