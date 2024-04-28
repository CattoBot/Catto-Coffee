import { ChatInputDeniedCommandHelper } from '@lib/helpers/bot/listeners/commands/chatInputDeniedCommandHelper';
import { Listener, type ChatInputCommandDeniedPayload, type UserError } from '@sapphire/framework';
import { SubcommandPluginEvents } from '@sapphire/plugin-subcommands';

export class ChatInputSubcommandDeniedListener extends Listener<typeof SubcommandPluginEvents.ChatInputSubcommandDenied> {
    private helper: ChatInputDeniedCommandHelper = new ChatInputDeniedCommandHelper();
    public async run({ context, message: content }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
        if (this.helper.shouldBeSilent(context)) return;
        if (this.helper.hasRemainingTime(context)) {
            await this.helper.handleCooldownReply(interaction, context);
        } else {
            await this.helper.handleReply(interaction, content);
        }
    }
}
