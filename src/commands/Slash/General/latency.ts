import { ChatInputCommand, Command } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { Colors, EmbedBuilder } from "discord.js";
import { Database } from "../../../structures/Database";

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'latency',
      fullCategory: ["General"],
      requiredClientPermissions: ["SendMessages"],
      requiredUserPermissions: ["SendMessages"],
      cooldownDelay: Time.Second * 10,
      cooldownLimit: 2
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName("ping").setDescription("Latencia actual del bot."),
      {
        idHints: [""],
      }
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {

    const msg = await interaction.reply(`Ping?`)

    let dbLatency: any
    const startTime = Date.now();
    await Database.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - startTime;

    const embed = new EmbedBuilder()
      .setDescription(`\`🟢\` Latency: \`${Math.round(this.container.client.ws.ping)}ms.\`ms\n\`🟢\` Data: \`${dbLatency}\`ms\n\`🟢\` API: ${msg.createdTimestamp - interaction.createdTimestamp}`)
      .setColor(Colors.Green)

    return interaction.editReply({
      content: '',
      embeds: [embed]
    });
  }
}