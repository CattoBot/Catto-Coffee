import { ApplicationCommandRegistries, LogLevel, RegisterBehavior, SapphireClient } from "@sapphire/framework";
import { Gateway } from "@shared/constants/core/gateway.constants";
import { Config } from "@core/config";
import { I18nConfig } from "@shared/constants/core/i18n";

export class Client extends SapphireClient {
	constructor(i18nConfig: typeof I18nConfig) {
		super({
			intents: [Gateway.Intents],
			partials: [Gateway.Partials],
			i18n: { fetchLanguage: I18nConfig.fetchLanguage.bind(i18nConfig) },
			defaultPrefix: Config.DefaultPrefix,
			defaultCooldown: { filteredUsers: Config.Owners },
			failIfNotExists: false,
			shards: Config.Shards,
			logger: { level: LogLevel.Info },
			loadMessageCommandListeners: true,
		});
	}

	public override login(token?: string) {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
		return super.login(token);
	}
}
