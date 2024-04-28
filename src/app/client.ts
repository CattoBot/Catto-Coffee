import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from "@sapphire/framework";
import { Gateway } from "@app/gateway";
import { Config as config } from "@app/config";

export class Client extends SapphireClient {
	constructor() {
		super(Gateway.Client);
	}

	/**
 * Discord LogIn.
 * @param token Discord Bot Token.
 * @returns Promise.
 */

	public override login(token?: string): Promise<string> {
		config.app.refreshCommands === true && ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
		return super.login(token);
	}
}
