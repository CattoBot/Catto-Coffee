import { Colors, EmbedBuilder } from 'discord.js';

export class Embed extends EmbedBuilder {
	constructor(description: string) {
		super({
			color: Colors.White,
			description: description,
			author: {
				name: 'Catto',
				iconURL: 'https://cdn.discordapp.com/avatars/1000184915591168080/5f9381a2da87453f74d7b1d6e463fd76.webp?size=1024'
			},
			timestamp: new Date()
			// footer: ({ text: 'Catto', iconURL: 'https://cdn.discordapp.com/avatars/1000184915591168080/5f9381a2da87453f74d7b1d6e463fd76.webp?size=1024' })
		});
	}
}
