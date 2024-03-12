import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Client } from "@core/client.core";
import { LogConnections } from "@lib/helpers/misc/connections.helper";

@ApplyOptions<ListenerOptions>({ once: true, event: Events.ClientReady })
export class ReadyListener extends Listener {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(client: Client) {
        await LogConnections.run(client);
    }
}