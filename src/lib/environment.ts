import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { ApplicationConsole } from './console';
import { ArrayString, IntegerString } from '@skyra/env-utilities';
import { ChatInputDeniedCommandHelper } from './events/commandDenied';
import { CloudinaryService } from './services/cloudinary';
import { Utils } from './utils';
import { Services } from './services';
import CoreHelper from './helpers';

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnlyPrecondition: never;
		GuildExistsPrecondition: never;
		GuildBlacklistPrecondition: never;
		UserBlacklistPrecondition: never;
		GuildUserBlacklistPrecondition: never;
		ChannelOwnerPrecondition: never;
		ChannelClaimPrecondition: never;
		RoleCommandPermitPrecondition: never;
		PremiumServerPrecondition: never;
		EditableChannelPrecondition: never;
		GuildVoiceOnlyPrecondition: never;
		EnabledCommandPrecondition: never;
		EnabledModulePrecondition: never;
	}
}

interface npm_package_file {
	name: string;
	version: string;
	main: string,
	author?: string|{name:string, email?:string, url?:string}
	constributors?: {name: string, email?:string, url?:string}[],
	license: string,
	type: string|'commonjs'|'module',
	dependencies: {
		[key: string]: string;
	};
	devDependencies: {
		[key: string]: string;
	};
	scripts: {
		[key: string]: string;
	};
	signale: {
		[key: string]: boolean;
	};
	prettier: string
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient;
		redis: Redis;
		console: ApplicationConsole;
		commandDeniedHelper: ChatInputDeniedCommandHelper
		cloudinary: CloudinaryService;
		utils: Utils;
		services: Services;
		helpers: CoreHelper;
		version: string;
		package: npm_package_file;
	}
}


declare module '@skyra/env-utilities' {
	interface Env {
		OWNERS: ArrayString;
		GUILD_ID: ArrayString;
		REDIS_HOST: string;
		REDIS_PORT: IntegerString;
		REDIS_TASK_DB: IntegerString;
		CLOUDINARY_CLOUD_NAME: string;
		CLOUDINARY_API_KEY: string;
		CLOUDINARY_API_SECRET: string;
	}
}
