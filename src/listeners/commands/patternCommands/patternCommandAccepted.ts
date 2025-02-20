import { Listener, Logger, LogLevel } from '@sapphire/framework';
import { PatternCommandEvents } from '@sapphire/plugin-pattern-commands';

export class PatternCommandAccepted extends Listener<typeof PatternCommandEvents.CommandAccepted> {
	constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			event: PatternCommandEvents.CommandAccepted
		});
	}

	public override run() {
		this.container.logger.debug('Pattern Command Accepted');
	}

	public override onLoad() {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
