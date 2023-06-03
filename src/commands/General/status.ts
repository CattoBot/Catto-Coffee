import { ChatInputCommand, Command } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import  Client  from "../../index";
import moment from "moment";

export class StatusCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      fullCategory: ["General"],
      requiredClientPermissions: ["SendMessages"],
      requiredUserPermissions: ["SendMessages"],
      cooldownDelay: Time.Second * 5,
      cooldownLimit: 2
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
        .setName("status")
        .setDescription("Estado actual y latencia del bot"),
      {
        idHints: [
            '1111927568686383144'
        ],
      }
    );
  }

  public override chatInputRun(interaction: ChatInputCommand.Interaction) {
    const nUptime = Date.now() - Client.readyTimestamp?.valueOf()!;
    const ping = this.container.client.ws.ping;
    const uptime = moment.duration(nUptime).humanize();
    return Client.InteractionEmbed(interaction, `\`\`\`ts\nLatencia: ${ping}ms\n\`\`\`\n\`\`\`ts\nUptime: ${uptime}\n\`\`\``);
  }
}