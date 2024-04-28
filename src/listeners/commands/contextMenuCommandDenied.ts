import { ChatInputDeniedCommandHelper } from "@lib/helpers/bot/listeners/commands/chatInputDeniedCommandHelper";
import { ContextMenuCommandDeniedHelper } from "@lib/helpers/bot/listeners/commands/contextMenuDeniedCommandHelper";
import { ChatInputCommandDeniedPayload, ContextMenuCommandDeniedPayload, Events, Listener, UserError } from "@sapphire/framework";

export class ContextMenuCommandDeniedListener extends Listener<typeof Events.ContextMenuCommandDenied> {
    private helper: ContextMenuCommandDeniedHelper = new ContextMenuCommandDeniedHelper();
    public async run({ context, message: content }: UserError, { interaction }: ContextMenuCommandDeniedPayload) {
        if (this.helper.shouldBeSilent(context)) return;
        if (this.helper.hasRemainingTime(context)) {
            await this.helper.handleCooldownReply(interaction, context);
        } else {
            await this.helper.handleReply(interaction, content);
        }
    }
}
