import { Message } from 'discord.js';
import { Embed } from '../../classes/Embed';
import { reply } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';

export class VoiceShowCommand {
	public static async messageRun(message: Message): Promise<void> {
		if (message.channel.isSendable()) await message.channel.sendTyping();
		await reply(message, {
			embeds: [
				new Embed(await resolveKey(message, `commands/replies/error:voice_default_command`)).setAuthor({
					name: message.author.displayName,
					iconURL: message.author.displayAvatarURL()
				})
			]
		});
	}
}
