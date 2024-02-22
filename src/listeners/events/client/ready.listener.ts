import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Client } from "@core/client.main";
import { Messages } from "@shared/constants/utils/utils.constants";
import { LatencyHelper } from "@lib/helpers/misc/latency.helper";
import { PresenceHelper } from "@lib/helpers/client/presence.helper";
import { ServerLogger } from "@lib/helpers/misc/logger.helper";
import { PrismaClient } from "@prisma/client";

@ApplyOptions<ListenerOptions>({ once: true, event: Events.ClientReady })
export class ReadyListener extends Listener {
    public log: ServerLogger = ServerLogger.getInstance();
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(client: Client) {
        await this.checkBotAndDatabaseLatency(client);
        await this.setPresence(client);
        return this.log.start(Messages.Success.BotReady(client.application.client.user.username));
    }

    private async checkBotAndDatabaseLatency(client: Client) {
        LatencyHelper.checkBotLatency(client)
        await LatencyHelper.checkDatabaseConnection(new PrismaClient)
    }

    private async setPresence(client: Client) {
        await PresenceHelper.setRandomActivity(client);
    }
}
