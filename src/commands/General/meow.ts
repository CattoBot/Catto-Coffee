import type { Message } from 'discord.js';
import { PatternCommand } from '@sapphire/plugin-pattern-commands';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<PatternCommand.Options>({
	aliases: ['gato', 'cat'],
	chance: 1
})
export class MeowCommand extends PatternCommand {
	public messageRun(message: Message) {
		message.reply('Meow! You got meowd with a 1% chance! ❤️');
	}
}