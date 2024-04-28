import { ChatInputDeniedCommandHelper } from '@lib/helpers/bot/listeners/commands/chatInputDeniedCommandHelper';
import { Events, Listener, UserError, type ChatInputCommandDeniedPayload } from '@sapphire/framework';

export class ChatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
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
