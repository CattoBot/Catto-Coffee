import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";
import kleur from "kleur";
const { bold } = kleur;

export class ReadyListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: true,
    });
  }

  public async run(client: Client) {
    return this.container.logger.info(bold().green(`Logged in as ${client.user?.tag}`));
  }
}