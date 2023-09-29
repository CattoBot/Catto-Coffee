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
    
    const shardPing = Math.round(this.container.client.ws.shards.first()?.ping ?? 0);

    let dbLatency: any
    const startTime = Date.now();
    await Database.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - startTime;

    const embed = new EmbedBuilder()
      .setDescription(`\`🟢\` Shard: \`${shardPing}\`ms\n\`🟢\` Data: \`${dbLatency}\`ms`)
      .setColor(Colors.Green)

    return interaction.reply({
      content: '',
      embeds: [embed]
    });
  }
}