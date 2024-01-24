import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { CattoClient } from "../../core/client.main";
import { Messages } from "../../shared/constants/utils/utils.constants";
import { LatencyHelper } from "../../helpers/core/latency.helper";
import { PresenceHelper } from "../../helpers/client/presence.helper";
import { Prisma } from "../../services/prisma.service";
import { ServerLogger } from "../../helpers/logs/ServerLogger";

@ApplyOptions<ListenerOptions>({ once: true, event: Events.ClientReady })
export class ReadyListener extends Listener {
    public log: ServerLogger = new ServerLogger()
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(client: CattoClient) {
        await this.checkBotAndDatabaseLatency(client);
        await this.setPresence(client);
        return this.log.start(Messages.Success.BotReady(client.application.client.user.username));
    }

    private async checkBotAndDatabaseLatency(client: CattoClient) {
        await LatencyHelper.checkBotLatency(client)
        await LatencyHelper.checkDatabaseConnection(new Prisma)
    }

    private async setPresence(client: CattoClient) {
        await PresenceHelper.setRandomActivity(client);
    }
}
