import * as dotenv from 'dotenv';

dotenv.config();

export const Config = {
	owners: process.env.OWNERS ? process.env.OWNERS.split(',') : [],
	prefix: '$',
	regexPrefix: /^(hey +)?catto[,! ]/i,
	refreshCommands: true,
	defaultLanguage: 'es-ES',
	version: 'v2.0.175',
	guilds: process.env.GUILD_ID ? process.env.GUILD_ID.split(',') : []
};
