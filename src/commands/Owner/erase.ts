import { ChatInputCommand, Command } from "@sapphire/framework";

export class ResetCommandsCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Resets the commands.",
      detailedDescription: "Resets the commands.",
       preconditions: ["OwnerOnly"],
    });
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName("erase")
          .setDescription("Elimina los comandos del bot."),
      {
        idHints: [""],
      }
    );
  }

  public override async chatInputRun(
    interaction: ChatInputCommand.Interaction
  ) {

    await interaction.deferReply({ ephemeral: true });
    await interaction.client.application?.commands.set([]);

    return interaction.editReply(
      `\`\`\`ts\nComandos eliminados con éxito.\`\`\``
    );
  }
}