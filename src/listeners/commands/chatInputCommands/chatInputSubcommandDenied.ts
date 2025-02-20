import { Listener, type UserError } from '@sapphire/framework';
import { ChatInputSubcommandDeniedPayload, SubcommandPluginEvents } from '@sapphire/plugin-subcommands';

export class ChatInputSubcommandDeniedListener extends Listener<typeof SubcommandPluginEvents.ChatInputSubcommandDenied> {
	public async run(error: UserError, payload: ChatInputSubcommandDeniedPayload): Promise<unknown> {
		const { context, message: content } = error;
		const { interaction } = payload;

		if (this.container.commandDeniedHelper.shouldBeSilent(context)) return;
		if (this.container.commandDeniedHelper.hasRemainingTime(context)) {
			await this.container.commandDeniedHelper.handleCooldownReply(interaction, context);
		} else {
			await this.container.commandDeniedHelper.handleReply(interaction, content);
		}

		return undefined;
	}
}
