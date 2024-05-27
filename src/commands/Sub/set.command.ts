import { ApplyOptions } from "@sapphire/decorators";
import { Subcommand, SubcommandOptions } from "@sapphire/plugin-subcommands";
import { ProfileCommandOptions } from "../../shared/bot/commands/options/SubCommands/profile";
import { ProfileSetInformationSubcommands } from "../../shared/bot/commands/build/profile";
import { BioModalHandler } from "../../shared/bot/modals/bio";

@ApplyOptions<SubcommandOptions>(ProfileCommandOptions.Options)
export class SetProfileCommands extends Subcommand {
    constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, { ...options });
    }

    override registerApplicationCommands(registry: Subcommand.Registry) {
        ProfileSetInformationSubcommands.registerCommands(registry);
    }


    public async chatInputBioName(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.showModal(BioModalHandler)
    }
}