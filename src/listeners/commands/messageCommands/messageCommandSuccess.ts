import type { MessageCommandSuccessPayload } from '@sapphire/framework';
import { Listener, LogLevel } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';

export class UserEvent extends Listener {
	public override run(payload: MessageCommandSuccessPayload) {
		this.container.utils.logger.logSuccessCommand(payload);
	}

	public override onLoad() {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
