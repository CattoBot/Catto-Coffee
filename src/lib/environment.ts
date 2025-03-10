import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { ApplicationConsole } from './console';
import { ArrayString } from '@skyra/env-utilities';
import { ChatInputDeniedCommandHelper } from './events/commandDenied';
import { CloudinaryService } from './services/cloudinary';
import { Utils } from './utils';
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

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient;
		redis: Redis;
		console: ApplicationConsole;
		commandDeniedHelper: ChatInputDeniedCommandHelper;
		cloudinary: CloudinaryService;
		utils: Utils;
		helpers: CoreHelper;
		version: string;
	}
}

declare module '@skyra/env-utilities' {
	interface Env {
		OWNERS: ArrayString;
		REDIS_HOST: string;
		REDIS_URL: string;
		CLOUDINARY_CLOUD_NAME: string;
		CLOUDINARY_API_KEY: string;
		CLOUDINARY_API_SECRET: string;
	}
}
