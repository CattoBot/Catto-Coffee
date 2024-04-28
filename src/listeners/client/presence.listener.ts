import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { Client } from "@app/client";
import { PresenceHelper as Presence } from "@lib/helpers/bot/client/presence.helper";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<ListenerOptions>({ once: false, event: Events.ClientReady })
export class PresenceListener extends Listener {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(client: Client) {
        return await Presence.set(client);
    }
}
