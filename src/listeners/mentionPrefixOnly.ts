import type { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
	public override async run(message: Message) {
		const prefix = await this.container.prisma.guilds.findUnique({ where: { guildId: message.guild?.id } }).then((guild) => guild?.prefix);
		return message.reply(
			prefix
				? `My prefix in this guild is: \`${prefix}\``
				: 'Cannot find any Prefix for Message Commands, You can always ping me or use `\$\` as a prefix.\n To set a new prefix please run `/manage set prefix`.'
		);
	}
}
