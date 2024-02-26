import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from "@sapphire/framework";
import { Gateway } from "@shared/constants/core/gateway.constants";

export class Client extends SapphireClient {
	constructor() {
		super(Gateway.ClientOptions);
	}

	public override login(token?: string) {
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
		return super.login(token);
	}
}
