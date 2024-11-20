-- CreateTable
CREATE TABLE `badges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `badgeUrl` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_BADGES_NAME_BADGEURL`(`name`, `badgeUrl`),
    UNIQUE INDEX `UQ_BADGES_NAME_BADGEURL`(`name`, `badgeUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bonus_text_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `roleId` VARCHAR(255) NOT NULL,
    `bonus` INTEGER NOT NULL DEFAULT 15,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_BONUS_TEXT_ROLES_GUILD_ID_ROLE_ID`(`guildId`, `roleId`),
    UNIQUE INDEX `UQ_BONUS_TEXT_ROLES_GUILD_ID_ROLE_ID`(`guildId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bonus_txt_channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
    `bonus` INTEGER NOT NULL DEFAULT 15,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_BONUS_TXT_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    UNIQUE INDEX `UQ_BONUS_TXT_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bonus_voice_channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
    `bonus` INTEGER NOT NULL DEFAULT 15,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_BONUS_VOICE_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    UNIQUE INDEX `UQ_BONUS_VOICE_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bonus_voice_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `roleId` VARCHAR(255) NOT NULL,
    `bonus` INTEGER NOT NULL DEFAULT 15,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_BONUS_VOICE_ROLES_GUILD_ID_ROLE_ID`(`guildId`, `roleId`),
    UNIQUE INDEX `UQ_BONUS_VOICE_ROLES_GUILD_ID_ROLE_ID`(`guildId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bot_black_listed_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_b019a21436233fec51404ebdbe`(`userId`),
    INDEX `IDX_BOT_BLACKLISTED_USERS_USER_ID`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_top` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `lastDailyMessageId` VARCHAR(255) NULL,
    `lastDailyTextMessageId` VARCHAR(255) NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_20b9309e7bb7f79d2417dd22fe`(`guildId`),
    INDEX `IDX_DAILY_TOP_GUILD_ID`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disabled_commands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `command` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_DISABLED_COMMANDS_GUILD_ID_COMMAND`(`guildId`, `command`),
    UNIQUE INDEX `UQ_DISABLED_COMMANDS_GUILD_ID_COMMAND`(`guildId`, `command`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disabled_modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `module` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_DISABLED_MODULES_GUILD_ID_MODULE`(`guildId`, `module`),
    UNIQUE INDEX `UQ_DISABLED_MODULES_GUILD_ID_MODULE`(`guildId`, `module`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `editable_channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `categoryId` VARCHAR(255) NOT NULL,
    `editable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_EDITABLE_CHANNELS_GUILD_ID_CATEGORY_ID`(`guildId`, `categoryId`),
    UNIQUE INDEX `UQ_EDITABLE_CHANNELS_GUILD_ID_CATEGORY_ID`(`guildId`, `categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `experience_role_rewards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `roleId` VARCHAR(255) NULL,
    `roleType` VARCHAR(255) NULL,
    `level` INTEGER NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_EXPERIENCE_ROLE_REWARDS_GUILD_ID_ROLE_ID_ROLE_TYPE`(`guildId`, `roleId`, `roleType`),
    UNIQUE INDEX `UQ_EXPERIENCE_ROLE_REWARDS_GUILD_ID_ROLE_ID_ROLE_TYPE`(`guildId`, `roleId`, `roleType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filtered_text_channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_FILTERED_TEXT_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    UNIQUE INDEX `UQ_FILTERED_TEXT_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filtered_voice_channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_FILTERED_VOICE_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    UNIQUE INDEX `UQ_FILTERED_VOICE_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_badges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `badgeId` INTEGER NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `FK_f89e65f9e554e9f361f0da5f594`(`badgeId`),
    INDEX `IDX_GUILD_BADGES_GUILD_ID_BADGE_ID`(`guildId`, `badgeId`),
    UNIQUE INDEX `UQ_GUILD_BADGES_GUILD_ID_BADGE_ID`(`guildId`, `badgeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_blacklisted_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(255) NOT NULL,
    `guildId` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_3e1c2d7aee2b592c55ef8d9421`(`userId`),
    INDEX `FK_3ae61ebf90f2a1c177edd551412`(`guildId`),
    INDEX `IDX_GUILD_BLACKLISTED_USERS_USER_ID`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guilds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `prefix` VARCHAR(5) NULL,
    `language` VARCHAR(5) NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_0699c7df346fa7be967e7eebd5`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `i_text_experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `min` INTEGER NOT NULL DEFAULT 5,
    `max` INTEGER NOT NULL DEFAULT 50,
    `isEnabled` BOOLEAN NOT NULL DEFAULT true,
    `cooldown` INTEGER NOT NULL DEFAULT 60,
    `msgChannelId` VARCHAR(255) NULL,
    `lvlUpMsg` VARCHAR(255) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_2d9f5eff627d519fbab6ef46b3`(`guildId`),
    INDEX `IDXprisma.i_text_experience_GUILD_ID`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `i_users_temp_voice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(255) NOT NULL,
    `channelName` VARCHAR(255) NULL,
    `channelLimit` INTEGER NULL,
    `isLocked` BOOLEAN NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_a6a3aeb831528fbdff96342aed`(`userId`),
    INDEX `IDX_I_USERS_TEMP_VOICE_USER_ID`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `i_voice_experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `min` INTEGER NOT NULL DEFAULT 5,
    `max` INTEGER NOT NULL DEFAULT 25,
    `isEnabled` BOOLEAN NOT NULL DEFAULT true,
    `cooldown` INTEGER NOT NULL DEFAULT 60,
    `msgChannelId` VARCHAR(255) NULL,
    `lvlUpMsg` VARCHAR(255) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_56eb586296e143b6967aa8d19d`(`guildId`),
    INDEX `IDX_I_VOICE_EXPERIENCE_GUILD_ID`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leaderboard_channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `weeklyVoiceTop10channelId` VARCHAR(255) NULL,
    `monthlyVoiceTop10channelId` VARCHAR(255) NULL,
    `dailyVoiceTop10channelId` VARCHAR(255) NULL,
    `dailyTextTop10channelId` VARCHAR(255) NULL,
    `weeklyTextTop10channelId` VARCHAR(255) NULL,
    `monthlyTextTop10channelId` VARCHAR(255) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_38ec21f88f22b5a483c52c8a6d`(`guildId`),
    INDEX `IDX_LEADERBOARD_CHANNELS_GUILD_ID`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthly_top` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `lastMonthlyMessageId` VARCHAR(255) NULL,
    `lastMonthlyTextMessageId` VARCHAR(255) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_0df52067f2b19400392a22725d`(`guildId`),
    INDEX `IDX_MONTHLY_TOP_GUILD_ID`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `premium_servers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_93c01a99067991862ae3b19b2f`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restricted_command_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `roleId` VARCHAR(255) NOT NULL,
    `commandName` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_RESTRICTED_COMMAND_ROLES_GUILD_ID_ROLE_ID_COMMAND_NAME`(`guildId`, `roleId`, `commandName`),
    UNIQUE INDEX `UQ_RESTRICTED_COMMAND_ROLES_GUILD_ID_ROLE_ID_COMMAND_NAME`(`guildId`, `roleId`, `commandName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_leaderboard_rewards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `roleId` VARCHAR(255) NOT NULL,
    `roleType` VARCHAR(255) NOT NULL,
    `level` INTEGER NOT NULL,
    `rewardType` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_ROLE_LEADERBOARD_REWARDS_GUILD_ID_ROLE_ID_ROLE_TYPE`(`guildId`, `roleId`, `roleType`),
    UNIQUE INDEX `UQ_ROLE_LEADERBOARD_REWARDS_GUILD_ID_ROLE_ID_ROLE_TYPE`(`guildId`, `roleId`, `roleType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trusted_voice_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_TRUSTED_VOICE_USERS_GUILD_ID_CHANNEL_ID_USER_ID`(`guildId`, `channelId`, `userId`),
    UNIQUE INDEX `UQ_TRUSTED_VOICE_USERS_GUILD_ID_CHANNEL_ID_USER_ID`(`guildId`, `channelId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_badges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(255) NOT NULL,
    `badgeId` INTEGER NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `FK_bd34ef334baea6f589a53438a1e`(`badgeId`),
    INDEX `IDX_USER_BADGES_USER_ID_BADGE_ID`(`userId`, `badgeId`),
    UNIQUE INDEX `UQ_USER_BADGES_USER_ID_BADGE_ID`(`userId`, `badgeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(255) NOT NULL,
    `globalExperience` INTEGER NOT NULL DEFAULT 0,
    `globalLevel` INTEGER NOT NULL DEFAULT 1,
    `totalGlobalExperience` INTEGER NOT NULL DEFAULT 0,
    `totalRegisteredMessages` INTEGER NOT NULL DEFAULT 0,
    `totalTimeInVoiceChannel` INTEGER NOT NULL DEFAULT 0,
    `aboutme` VARCHAR(255) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_8bf09ba754322ab9c22a215c91`(`userId`),
    INDEX `IDX_USERS_USER_ID`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_rank_card_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(255) NOT NULL,
    `background` VARCHAR(255) NULL,
    `fontColor` VARCHAR(255) NULL,
    `progressBarFirstColor` VARCHAR(255) NULL,
    `progressBarSecondColor` VARCHAR(255) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_173a1c5567e4fded286417dbc8`(`userId`),
    INDEX `IDX_USERS_RANK_CARD_CONFIG_USER_ID`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `text_experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `textExperience` INTEGER NOT NULL DEFAULT 0,
    `textLevel` INTEGER NOT NULL DEFAULT 1,
    `totalTextExperience` INTEGER NOT NULL DEFAULT 0,
    `totalMessagesDaily` INTEGER NOT NULL DEFAULT 0,
    `totalMessagesWeekly` INTEGER NOT NULL DEFAULT 0,
    `totalMessagesMonthly` INTEGER NOT NULL DEFAULT 0,
    `totalMessages` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_TEXT_EXPERIENCE_GUILD_ID_USER_ID`(`guildId`, `userId`),
    UNIQUE INDEX `UQ_TEXT_EXPERIENCE_GUILD_ID_USER_ID`(`guildId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voice_experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `voiceExperience` INTEGER NOT NULL DEFAULT 0,
    `voiceLevel` INTEGER NOT NULL DEFAULT 1,
    `dailyTimeInVoiceChannel` INTEGER NOT NULL DEFAULT 0,
    `weeklyTimeInVoiceChannel` INTEGER NOT NULL DEFAULT 0,
    `monthlyTimeInVoiceChannel` INTEGER NOT NULL DEFAULT 0,
    `totalVoiceExperience` INTEGER NOT NULL DEFAULT 0,
    `totalTimeInVoiceChannel` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_VOICE_EXPERIENCE_GUILD_ID_USER_ID`(`guildId`, `userId`),
    UNIQUE INDEX `UQ_VOICE_EXPERIENCE_GUILD_ID_USER_ID`(`guildId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voice_temp_channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
    `channelOwnerId` VARCHAR(255) NOT NULL,
    `channelCategoryId` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_VOICE_TEMP_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    UNIQUE INDEX `UQ_VOICE_TEMP_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webhooks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
    `webhookId` VARCHAR(255) NOT NULL,
    `webhookToken` VARCHAR(255) NOT NULL,
    `iv` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_4c839321cea8a9d667bb7fe73b`(`guildId`),
    INDEX `IDX_WEBHOOKS_GUILD_ID`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weekly_top` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `lastWeeklyMessageId` VARCHAR(255) NULL,
    `lastWeeklyTextMessageId` VARCHAR(255) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_3c15071d1f77003659f418036f`(`guildId`),
    INDEX `IDX_WEEKLY_TOP_GUILD_ID`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bot_black_listed_guilds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_aff80b4580b3ae75b76898e974`(`guildId`),
    INDEX `IDX_BOT_BLACKLISTED_GUILDS_GUILD_ID`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PermittedVoiceRoles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `roleId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `PermittedVoiceRoles_guildId_roleId_channelId_key`(`guildId`, `roleId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `i_voice_temp_channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
    `categoryId` VARCHAR(255) NOT NULL,
    `editables` BOOLEAN NULL,
    `channelLimit` INTEGER NULL,
    `channelName` VARCHAR(255) NULL,
    `shouldEnumerate` BOOLEAN NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `i_voice_temp_channels_channelId_key`(`channelId`),
    UNIQUE INDEX `UQ_I_VOICE_TEMP_CHANNELS_GUILD_ID_CHANNEL_ID`(`guildId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bonus_text_roles` ADD CONSTRAINT `FK_2fbcff9af4ecb51aa7a50961b53` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bonus_txt_channels` ADD CONSTRAINT `FK_d25d65950f5c4bc1d596562d0d9` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bonus_voice_channels` ADD CONSTRAINT `FK_e51b7d1bc86094a70207e41abeb` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bonus_voice_roles` ADD CONSTRAINT `FK_22c32b002aef29b5087434cb96e` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `daily_top` ADD CONSTRAINT `FK_20b9309e7bb7f79d2417dd22fe8` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `disabled_commands` ADD CONSTRAINT `FK_2139af764cd9f1a77dd2010e675` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `disabled_modules` ADD CONSTRAINT `FK_48a9e3ee2614cfecc42aab3dd57` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `editable_channels` ADD CONSTRAINT `FK_b8daf2b34688aedd9a7b8243a9b` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `experience_role_rewards` ADD CONSTRAINT `FK_b68f08aa223f622c1b9e6cc8c49` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `filtered_text_channels` ADD CONSTRAINT `FK_f6c35f5c740527fe025390f4aa8` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `filtered_voice_channels` ADD CONSTRAINT `FK_0a19fdbc56b4cd66d4c5ba73182` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `guild_badges` ADD CONSTRAINT `FK_de50e1ff582eacd335db69b6387` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `guild_badges` ADD CONSTRAINT `FK_f89e65f9e554e9f361f0da5f594` FOREIGN KEY (`badgeId`) REFERENCES `badges`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `guild_blacklisted_users` ADD CONSTRAINT `FK_3ae61ebf90f2a1c177edd551412` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `i_text_experience` ADD CONSTRAINT `FK_2d9f5eff627d519fbab6ef46b37` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `i_voice_experience` ADD CONSTRAINT `FK_56eb586296e143b6967aa8d19d2` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `leaderboard_channels` ADD CONSTRAINT `FK_38ec21f88f22b5a483c52c8a6df` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `monthly_top` ADD CONSTRAINT `FK_0df52067f2b19400392a22725d2` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `premium_servers` ADD CONSTRAINT `FK_93c01a99067991862ae3b19b2f9` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `restricted_command_roles` ADD CONSTRAINT `FK_c1871e1a216a2431eb5ac2b6669` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `role_leaderboard_rewards` ADD CONSTRAINT `FK_35ab550d6594edebfa8d361ac5c` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `trusted_voice_users` ADD CONSTRAINT `FK_8f3787e1edb92f9815d8191413c` FOREIGN KEY (`guildId`, `channelId`) REFERENCES `voice_temp_channels`(`guildId`, `channelId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_badges` ADD CONSTRAINT `FK_7043fd1cb64ec3f5ebdb878966c` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_badges` ADD CONSTRAINT `FK_bd34ef334baea6f589a53438a1e` FOREIGN KEY (`badgeId`) REFERENCES `badges`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_rank_card_config` ADD CONSTRAINT `FK_173a1c5567e4fded286417dbc82` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `text_experience` ADD CONSTRAINT `FK_04abffedff742a06c2e0adc266c` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `voice_experience` ADD CONSTRAINT `FK_7a259b73a1a6c41f01d7803331a` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `voice_temp_channels` ADD CONSTRAINT `FK_9bcf00e5620cad33d34ce0284fa` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `webhooks` ADD CONSTRAINT `FK_4c839321cea8a9d667bb7fe73b0` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `weekly_top` ADD CONSTRAINT `FK_3c15071d1f77003659f418036f7` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `PermittedVoiceRoles` ADD CONSTRAINT `PermittedVoiceRoles_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermittedVoiceRoles` ADD CONSTRAINT `PermittedVoiceRoles_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `i_voice_temp_channels`(`channelId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `i_voice_temp_channels` ADD CONSTRAINT `FK_16ff10431a152f251d317d955b8` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
