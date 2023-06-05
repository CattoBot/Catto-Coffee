import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";
import kleur from "kleur";
import { getUsersInVoiceChannels } from "../../utils/functions/Exp System/Voice/checkVoice";
const { bold } = kleur;

export class ReadyListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: true,
    });
  }

  public async run(client: Client) {
    await getUsersInVoiceChannels();
    return this.container.logger.info(`Logged in as ${client.user?.tag}`);
  }
}