import { ChatInputCommand, Command } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import Client from "../../index";
import moment from "moment";
import { Prisma } from "../../client/PrismaClient";

export class StatusCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      fullCategory: ["General"],
      requiredClientPermissions: ["SendMessages"],
      requiredUserPermissions: ["SendMessages"],
      cooldownDelay: Time.Second * 10,
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName("status").setDescription("Estado actual y latencia del bot"),
      {
        idHints: ["1111927568686383144"],
      }
    );
  }

  public override async  chatInputRun(interaction: ChatInputCommand.Interaction) {
    const nUptime = Date.now() - Client.readyTimestamp?.valueOf()!;
    const ping = this.container.client.ws.ping;
    const uptime = moment.duration(nUptime).humanize();

    let dbLatency;
      const startTime = Date.now();
      await Prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - startTime;

    const latencyString = dbLatency >= 0 ? `${dbLatency}ms` : "Error";
    const embedText = `\`\`\`ts\nBot: ${ping}ms\n\`\`\`\n\`\`\`ts\nBase de datos: ${latencyString}\`\`\`\n\`\`\`ts\nActividad: ${uptime}\`\`\``;

    return Client.InteractionEmbed(interaction, embedText);
  }
}