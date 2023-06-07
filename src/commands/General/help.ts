import { ChatInputCommand, Command } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from "discord.js";
import config from "../../config";

export class HelpCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      fullCategory: ["General"],
      requiredClientPermissions: ["SendMessages"],
      requiredUserPermissions: ["SendMessages"],
      cooldownDelay: Time.Second * 10,
      cooldownLimit: 2
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName("help").setDescription("Información sobre los comandos del bot"),
      {
        idHints: [""],
      }
    );
  }

  public override async  chatInputRun(interaction: ChatInputCommand.Interaction) {

    const row = new ActionRowBuilder<ButtonBuilder>({
        components: [

            new ButtonBuilder({
                label: 'Documentación',
                style: ButtonStyle.Link,
                url: `${config.BotSettings.DocumentationLink}`
            }),
        ]
    })

    interaction.reply({
        content: `**<a:cattobell:1114454366213115965> Para saber todos mis comandos haz click [aquí](https://cattobot.github.io/Catto-Documentation/)**`,
        components: [row]
    });
  }
}