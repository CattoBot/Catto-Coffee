import { Listener, Logger, LogLevel } from '@sapphire/framework';
import { PatternCommandEvents } from '@sapphire/plugin-pattern-commands';

export class PatternCommandSuccess extends Listener<typeof PatternCommandEvents.CommandSuccess> {
	constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			event: PatternCommandEvents.CommandSuccess
		});
	}

	public override run() {
		this.container.logger.debug('Pattern Command Success');
	}

	public override onLoad() {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
