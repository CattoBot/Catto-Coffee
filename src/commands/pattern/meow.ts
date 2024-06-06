import type { Message } from 'discord.js';
import { PatternCommand } from '@sapphire/plugin-pattern-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { resolveKey } from '@sapphire/plugin-i18next';

@ApplyOptions<PatternCommand.Options>({
	aliases: ['gato', 'cat'],
	chance: 1
})
export class MeowCommand extends PatternCommand {
	public async messageRun(message: Message) {
		message.reply({ content: await resolveKey(message, 'commands/replies/pattern:meow') });
	}
}