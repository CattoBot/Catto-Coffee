import { ChatInputCommand, Command, CommandOptions } from "@sapphire/framework";
import { Colors, EmbedBuilder } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import { Commands } from "@shared/commands/options/commands/commands.options";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Cooldown } from "@lib/decorators/cooldown";
@ApplyOptions<CommandOptions>(Commands.PingCommand)
export class PingCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options
        });
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName(this.name).setDescription(this.description)
        );
    }

    @Cooldown({ minutes: 1, executionLimit: 2 })
    public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Aqua)
                    .setDescription(await resolveKey(interaction, 'commands/replies/ping:success_with_args', { latency: this.container.client.ws.ping }))
            ]
        })
    }
}