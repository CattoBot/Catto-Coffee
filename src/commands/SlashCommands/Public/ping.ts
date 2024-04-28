import { ChatInputCommand, Command, CommandOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Commands } from "@shared/commands/options/commands/commands.options";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Embed } from "@utils/embeds";
import { Config } from "@app/config";

@ApplyOptions<CommandOptions>(Commands.PingCommand)
export class PingCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options
        });
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description),
            { idHints: [], guildIds: [] }
        )
    }

    public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
        await interaction.reply({
            embeds: [new Embed(await resolveKey(interaction, 'commands/replies/ping:success_with_args', { latency: this.container.client.ws.ping }))]
        })
    }
}