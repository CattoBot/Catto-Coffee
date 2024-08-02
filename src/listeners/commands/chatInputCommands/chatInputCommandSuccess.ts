import { Listener, LogLevel, type ChatInputCommandSuccessPayload } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';

export class ChatInputCommandSuccessListener extends Listener {
	public override run(payload: ChatInputCommandSuccessPayload) {
		this.container.utils.logger.logSuccessCommand(payload);
	}

	public override onLoad() {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
