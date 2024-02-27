import { Listener } from "@sapphire/framework";

export abstract class ClientListener extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public abstract run(): void;
}