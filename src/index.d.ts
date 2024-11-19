import { PrismaClient } from "@prisma/client";
import { ArrayString, IntegerString } from "@skyra/env-utilities";
import Redis from "ioredis";
import { ApplicationConsole } from "./lib/console";
import { ChatInputDeniedCommandHelper } from "./lib/events/commandDenied";
import CoreHelper from "./lib/helpers";
import { CloudinaryService } from "./lib/services/cloudinary";
import { Utils } from "./lib/utils";

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
		commandDeniedHelper: ChatInputDeniedCommandHelper
		cloudinary: CloudinaryService;
		utils: Utils;
		helpers: CoreHelper;
		version: string;
	}
}


declare module '@skyra/env-utilities' {
	interface Env {
		OWNERS: ArrayString;
		GUILD_ID: ArrayString;
		REDIS_HOST: string;
		REDIS_PORT: IntegerString;
		REDIS_TASK_DB: IntegerString;
		REDIS_PASSWORD: string;
		CLOUDINARY_CLOUD_NAME: string;
		CLOUDINARY_API_KEY: string;
		CLOUDINARY_API_SECRET: string;
	}
}
