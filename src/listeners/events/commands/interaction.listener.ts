import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { CommandInteraction } from "discord.js";
import { User } from "@lib/database/schemas/user.schema";

@ApplyOptions<ListenerOptions>({ once: false, event: Events.InteractionCreate })
export class UpdateDatabaseCommandListener extends Listener {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(interaction: CommandInteraction) {
        if (!interaction.isCommand()) return;

        try {

            await User.create({
                id: interaction.user.id,
                commandsUsed: 1
            });

            this.container.logger.info(`Comando utilizado por ${interaction.user.tag}`);
        } catch (error) {
            this.container.logger.error(error);
        }
    }
}
