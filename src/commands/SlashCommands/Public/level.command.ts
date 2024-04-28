import { ChatInputCommand, Command, CommandOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Commands } from "@shared/commands/options/commands/commands.options";
import { resolveKey } from "@sapphire/plugin-i18next";

import { Embed } from "@utils/embeds";

@ApplyOptions<CommandOptions>(Commands.Level)
export class LevelCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options
        });
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
    }
    
    public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
        await interaction.reply({
            embeds: [new Embed('Rank Command!')]
        })
    }
}