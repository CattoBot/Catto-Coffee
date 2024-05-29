import { Listener, Logger, LogLevel } from "@sapphire/framework";
import { PatternCommandEvents } from "@sapphire/plugin-pattern-commands";

export class PatternCommandDenied extends Listener<typeof PatternCommandEvents.CommandDenied> {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: PatternCommandEvents.CommandDenied
        });
    }

    public override run() {
        this.container.logger.debug('Pattern Command Denied');
    }

    public override onLoad() {
        this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
        return super.onLoad();
    }
}