import { ApplyOptions } from '@sapphire/decorators';
import { Listener, UserError } from '@sapphire/framework';
import { MessageSubcommandDeniedPayload, SubcommandPluginEvents } from '@sapphire/plugin-subcommands';

@ApplyOptions<Listener.Options>({ event: SubcommandPluginEvents.MessageSubcommandDenied })
export class MessageSubcommandDeniedListener extends Listener<typeof SubcommandPluginEvents.MessageSubcommandDenied> {
	public override async run(error: UserError, payload: MessageSubcommandDeniedPayload) {
		const { context, message: content } = error;
		const { message } = payload;
		if (Reflect.get(Object(context), 'silent')) return;

		return message.reply({ content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}
