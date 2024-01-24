import { ChatInputCommand, Command, CommandOptions } from "@sapphire/framework";
import { Colors, EmbedBuilder } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<CommandOptions>({
    name: 'ping', description: 'Check bot latency',
    fullCategory: ['public'], requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"], cooldownLimit: 2
})

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

    public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`\`🟢\` Latency: \`${Math.round(this.container.client.ws.ping)}\`ms.`)
                    .setColor(Colors.Green)
            ]
        })
    }
}