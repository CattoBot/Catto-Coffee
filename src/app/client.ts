import { LogLevel, SapphireClient, container } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import { InternationalizationContext } from '@sapphire/plugin-i18next';
import { GatewayIntentBits, Partials } from 'discord.js';
import { getRootData } from '@sapphire/pieces';
import { join } from 'path';
import { Redis } from 'ioredis';
import { ApplicationConsole } from '../lib/console';
import { ChatInputDeniedCommandHelper } from '../lib/events/commandDenied';
import { Config } from '../config';
import { Utils } from '../lib/utils';
import { CloudinaryService } from '../lib/services/cloudinary';
import Helper from '../lib/helpers/index';
import { PrismaClient } from '@prisma/client';

export class ApplicationClient extends SapphireClient {
	private rootData = getRootData();
	constructor() {
		super({
			defaultPrefix: Config.prefix,
			regexPrefix: Config.regexPrefix,
			caseInsensitiveCommands: true,
			logger: {
				level: LogLevel.Debug
			},
			shards: 'auto',
			intents: [
				GatewayIntentBits.DirectMessageReactions,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildModeration,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.MessageContent
			],
			fetchPrefix: async (message) => {
				if (message.guild?.id) {
					const prefix = await container.utils.guilds.getPrefix(message.guild.id);
					return prefix;
				}
				return Config.prefix;
			},
			partials: [Partials.Channel, Partials.User, Partials.GuildMember, Partials.Message],
			presence: {
				status: 'idle'
			},
			loadMessageCommandListeners: true,
			tasks: {
				bull: {
					connection: {
						url: envParseString('REDIS_URL')
					}
				}
			},
			i18n: {
				fetchLanguage: async (context: InternationalizationContext) => {
					const guild = await container.prisma.guilds.findUnique({ where: { guildId: context.guild?.id } });
					return guild?.language || Config.defaultLanguage;
				}
			},
			loadApplicationCommandRegistriesStatusListeners: true
		});

		this.stores.get('interaction-handlers').registerPath(join(this.rootData.root, 'interactions'));
		this.stores.get('scheduled-tasks').registerPath(join(this.rootData.root, 'tasks'));
	}

	public override async login(token?: string): Promise<string> {
		container.prisma = new PrismaClient();
		container.redis = new Redis(envParseString('REDIS_URL'));
		container.console = new ApplicationConsole();
		container.cloudinary = new CloudinaryService();
		container.commandDeniedHelper = new ChatInputDeniedCommandHelper();
		container.utils = new Utils();
		container.helpers = new Helper();
		container.version = Config.version;
		return super.login(token);
	}
}
