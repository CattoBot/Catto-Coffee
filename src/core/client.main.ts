import { ApplicationCommandRegistries, LogLevel, RegisterBehavior, SapphireClient } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { Gateway } from "../shared/constants/core/gateway.constants";
import { Properties } from "../shared/constants/client/properties.constants";

export class CattoClient extends SapphireClient {
	constructor() {
		super({
			intents: [Gateway.Intents],
			partials: [Gateway.Partials],
			defaultPrefix: Properties.Prefix,
			defaultCooldown: { delay: Time.Second * 5, filteredUsers: Properties.Owners },
			failIfNotExists: false,
			shards: Properties.Shards,
			logger: { level: LogLevel.Info },
			loadMessageCommandListeners: true,
		});
	}

	public override login(token?: string) {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
		return super.login(token);
	}
}
