-- CreateTable
CREATE TABLE `Guilds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `guild_prefix` VARCHAR(5) NULL,
    `guild_language` VARCHAR(5) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Guilds_guild_id_key`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DisabledModules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `module_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DisabledModules_guild_id_module_name_idx`(`guild_id`, `module_name`),
    UNIQUE INDEX `DisabledModules_guild_id_module_name_key`(`guild_id`, `module_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DisabledCommands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `command_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DisabledCommands_guild_id_command_name_idx`(`guild_id`, `command_name`),
    UNIQUE INDEX `DisabledCommands_guild_id_command_name_key`(`guild_id`, `command_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PremiumServers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PremiumServers_guild_id_key`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filteredVoiceChannels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `filteredVoiceChannels_guild_id_channel_id_idx`(`guild_id`, `channel_id`),
    UNIQUE INDEX `filteredVoiceChannels_guild_id_channel_id_key`(`guild_id`, `channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filteredTextChannels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `filteredTextChannels_guild_id_channel_id_idx`(`guild_id`, `channel_id`),
    UNIQUE INDEX `filteredTextChannels_guild_id_channel_id_key`(`guild_id`, `channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BonusTXTChannels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BonusTXTChannels_guild_id_channel_id_idx`(`guild_id`, `channel_id`),
    UNIQUE INDEX `BonusTXTChannels_guild_id_channel_id_key`(`guild_id`, `channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BonusVoiceChannels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BonusVoiceChannels_guild_id_channel_id_idx`(`guild_id`, `channel_id`),
    UNIQUE INDEX `BonusVoiceChannels_guild_id_channel_id_key`(`guild_id`, `channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BonusTextRoles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BonusTextRoles_guild_id_role_id_idx`(`guild_id`, `role_id`),
    UNIQUE INDEX `BonusTextRoles_guild_id_role_id_key`(`guild_id`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BonusVoiceRoles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `bonus` INTEGER NULL DEFAULT 15,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BonusVoiceRoles_guild_id_role_id_idx`(`guild_id`, `role_id`),
    UNIQUE INDEX `BonusVoiceRoles_guild_id_role_id_key`(`guild_id`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MonthlyTop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `last_monthly_message_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MonthlyTop_guild_id_key`(`guild_id`),
    INDEX `MonthlyTop_guild_id_idx`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeeklyTop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `last_weekly_message_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `WeeklyTop_guild_id_key`(`guild_id`),
    INDEX `WeeklyTop_guild_id_idx`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyTop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `last_daily_message_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DailyTop_guild_id_key`(`guild_id`),
    INDEX `DailyTop_guild_id_idx`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaderboardChannels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `weekly_vc_channel_id` VARCHAR(191) NULL,
    `monthly_vc_channel_id` VARCHAR(191) NULL,
    `daily_vc_cchannel_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LeaderboardChannels_guild_id_key`(`guild_id`),
    INDEX `LeaderboardChannels_guild_id_idx`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Users_user_id_key`(`user_id`),
    INDEX `Users_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Badges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `badgeUrl` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Badges_name_badgeUrl_idx`(`name`, `badgeUrl`),
    UNIQUE INDEX `Badges_name_badgeUrl_key`(`name`, `badgeUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildBadges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(191) NOT NULL,
    `badgeId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GuildBadges_guildId_badgeId_idx`(`guildId`, `badgeId`),
    UNIQUE INDEX `GuildBadges_guildId_badgeId_key`(`guildId`, `badgeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserBadges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `badgeId` INTEGER NOT NULL,

    UNIQUE INDEX `UserBadges_id_key`(`id`),
    INDEX `UserBadges_userId_badgeId_idx`(`userId`, `badgeId`),
    PRIMARY KEY (`userId`, `badgeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersRankCardConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `background_url` VARCHAR(191) NULL,
    `font_color` VARCHAR(191) NULL,
    `bar_first_color` VARCHAR(191) NULL,
    `bar_second_color` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UsersRankCardConfig_user_id_key`(`user_id`),
    INDEX `UsersRankCardConfig_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildBlacklistedUsers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `guild_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GuildBlacklistedUsers_user_id_key`(`user_id`),
    INDEX `GuildBlacklistedUsers_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BotBlackListedGuilds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BotBlackListedGuilds_guild_id_key`(`guild_id`),
    INDEX `BotBlackListedGuilds_guild_id_idx`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BotBlackListedUsers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BotBlackListedUsers_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iTextExperience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `min_exp` INTEGER NULL DEFAULT 5,
    `max_exp` INTEGER NULL DEFAULT 50,
    `isEnabled` BOOLEAN NULL DEFAULT true,
    `exp_cd` INTEGER NULL DEFAULT 60,
    `msg_channel_id` VARCHAR(191) NULL,
    `lvlup_msg` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `iTextExperience_guild_id_key`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iVoiceExperience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `min_exp` INTEGER NULL DEFAULT 5,
    `max_exp` INTEGER NULL DEFAULT 25,
    `isEnabled` BOOLEAN NULL DEFAULT true,
    `exp_cd` INTEGER NULL DEFAULT 60,
    `msg_channel_id` VARCHAR(191) NULL,
    `lvlup_msg` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `iVoiceExperience_guild_id_key`(`guild_id`),
    INDEX `iVoiceExperience_guild_id_idx`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iVoiceTempChannels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `create_channel_id` VARCHAR(191) NOT NULL,
    `create_channel_parent_id` VARCHAR(191) NOT NULL,
    `is_editable` BOOLEAN NULL,
    `channel_limit` INTEGER NULL,
    `default_channel_name` VARCHAR(191) NULL,
    `should_enumerate` BOOLEAN NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `iVoiceTempChannels_guild_id_create_channel_id_idx`(`guild_id`, `create_channel_id`),
    UNIQUE INDEX `iVoiceTempChannels_guild_id_create_channel_id_key`(`guild_id`, `create_channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EditableChannels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `editable` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EditableChannels_guild_id_category_id_idx`(`guild_id`, `category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoiceTempChannels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `channel_owner_id` VARCHAR(191) NOT NULL,
    `channel_category_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `VoiceTempChannels_guild_id_channel_id_idx`(`guild_id`, `channel_id`),
    UNIQUE INDEX `VoiceTempChannels_guild_id_channel_id_key`(`guild_id`, `channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrustedVoiceUsers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `TrustedVoiceUsers_guild_id_channel_id_user_id_idx`(`guild_id`, `channel_id`, `user_id`),
    UNIQUE INDEX `TrustedVoiceUsers_guild_id_channel_id_user_id_key`(`guild_id`, `channel_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iUsersTempVoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `channel_name` VARCHAR(191) NULL,
    `channel_limit` INTEGER NULL,
    `is_channel_locked` BOOLEAN NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `iUsersTempVoice_user_id_key`(`user_id`),
    INDEX `iUsersTempVoice_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoiceExperience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `vc_xp` INTEGER NULL DEFAULT 0,
    `vc_lvl` INTEGER NULL DEFAULT 1,
    `daily_vc_time` INTEGER NULL DEFAULT 0,
    `weekly_vc_time` INTEGER NULL DEFAULT 0,
    `monthly_vc_time` INTEGER NULL DEFAULT 0,
    `total_vc_exp` INTEGER NULL DEFAULT 0,
    `total_vc_time` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VoiceExperience_guild_id_user_id_idx`(`guild_id`, `user_id`),
    UNIQUE INDEX `VoiceExperience_guild_id_user_id_key`(`guild_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TextExperience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `txt_xp` INTEGER NULL DEFAULT 0,
    `txt_lvl` INTEGER NULL DEFAULT 1,
    `total_txt_exp` INTEGER NULL DEFAULT 0,
    `total_daily_msgs` INTEGER NULL DEFAULT 0,
    `total_weekly_msgs` INTEGER NULL DEFAULT 0,
    `total_monthly_msgs` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TextExperience_guild_id_user_id_idx`(`guild_id`, `user_id`),
    UNIQUE INDEX `TextExperience_guild_id_user_id_key`(`guild_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Webhooks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `webhook_id` VARCHAR(191) NOT NULL,
    `webhook_token` VARCHAR(191) NOT NULL,
    `iv` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Webhooks_guild_id_key`(`guild_id`),
    INDEX `Webhooks_guild_id_idx`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RestrictedCommandRoles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `command_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RestrictedCommandRoles_guild_id_role_id_command_name_idx`(`guild_id`, `role_id`, `command_name`),
    UNIQUE INDEX `RestrictedCommandRoles_guild_id_role_id_command_name_key`(`guild_id`, `role_id`, `command_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceRoleRewards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NULL,
    `role_type` VARCHAR(191) NULL,
    `level` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `ExperienceRoleRewards_guild_id_role_id_role_type_idx`(`guild_id`, `role_id`, `role_type`),
    UNIQUE INDEX `ExperienceRoleRewards_guild_id_role_id_role_type_key`(`guild_id`, `role_id`, `role_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleLeaderboardRewards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `role_type` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `reward_type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `RoleLeaderboardRewards_guild_id_role_id_role_type_idx`(`guild_id`, `role_id`, `role_type`),
    UNIQUE INDEX `RoleLeaderboardRewards_guild_id_role_id_role_type_key`(`guild_id`, `role_id`, `role_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DisabledModules` ADD CONSTRAINT `DisabledModules_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DisabledCommands` ADD CONSTRAINT `DisabledCommands_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PremiumServers` ADD CONSTRAINT `PremiumServers_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `filteredVoiceChannels` ADD CONSTRAINT `filteredVoiceChannels_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `filteredTextChannels` ADD CONSTRAINT `filteredTextChannels_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BonusTXTChannels` ADD CONSTRAINT `BonusTXTChannels_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BonusVoiceChannels` ADD CONSTRAINT `BonusVoiceChannels_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BonusTextRoles` ADD CONSTRAINT `BonusTextRoles_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BonusVoiceRoles` ADD CONSTRAINT `BonusVoiceRoles_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MonthlyTop` ADD CONSTRAINT `MonthlyTop_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeeklyTop` ADD CONSTRAINT `WeeklyTop_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyTop` ADD CONSTRAINT `DailyTop_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaderboardChannels` ADD CONSTRAINT `LeaderboardChannels_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildBadges` ADD CONSTRAINT `GuildBadges_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildBadges` ADD CONSTRAINT `GuildBadges_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `Badges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBadges` ADD CONSTRAINT `UserBadges_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBadges` ADD CONSTRAINT `UserBadges_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `Badges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersRankCardConfig` ADD CONSTRAINT `UsersRankCardConfig_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildBlacklistedUsers` ADD CONSTRAINT `GuildBlacklistedUsers_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `iTextExperience` ADD CONSTRAINT `iTextExperience_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `iVoiceExperience` ADD CONSTRAINT `iVoiceExperience_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `iVoiceTempChannels` ADD CONSTRAINT `iVoiceTempChannels_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EditableChannels` ADD CONSTRAINT `EditableChannels_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoiceTempChannels` ADD CONSTRAINT `VoiceTempChannels_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrustedVoiceUsers` ADD CONSTRAINT `TrustedVoiceUsers_guild_id_channel_id_fkey` FOREIGN KEY (`guild_id`, `channel_id`) REFERENCES `VoiceTempChannels`(`guild_id`, `channel_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoiceExperience` ADD CONSTRAINT `VoiceExperience_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TextExperience` ADD CONSTRAINT `TextExperience_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Webhooks` ADD CONSTRAINT `Webhooks_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RestrictedCommandRoles` ADD CONSTRAINT `RestrictedCommandRoles_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceRoleRewards` ADD CONSTRAINT `ExperienceRoleRewards_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleLeaderboardRewards` ADD CONSTRAINT `RoleLeaderboardRewards_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
