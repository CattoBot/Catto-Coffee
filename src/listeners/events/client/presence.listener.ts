import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { Client } from "@core/client.core";
import { PresenceHelper } from "@lib/helpers/bot/client/presence.helper";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<ListenerOptions>({ once: false, event: Events.ClientReady })
export class PresenceListener extends Listener {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(client: Client) {
        await this.setPresence(client);
    }


    private async setPresence(client: Client) {
        await PresenceHelper.setPresence(client);
    }
}
