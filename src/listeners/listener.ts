import { Listener } from "@sapphire/framework";

export abstract class Event extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }
}