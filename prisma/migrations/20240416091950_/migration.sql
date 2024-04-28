-- CreateTable
CREATE TABLE `Guilds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `guild_prefix` VARCHAR(5) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Guilds_guild_id_key`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iNotes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `notes_log_channel_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `iNotes_guild_id_key`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iTextXP` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `txt_exp_amount_min` INTEGER NULL,
    `txt_exp_amount_max` INTEGER NULL,
    `is_enabled` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `iTextXP_id_guild_id_key`(`id`, `guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iVoiceXP` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `min_exp` INTEGER NULL,
    `max_exp` INTEGER NULL,
    `isEnabled` BOOLEAN NULL DEFAULT true,
    `exp_cd` INTEGER NULL,
    `msg_channel_id` VARCHAR(191) NULL,
    `lvlup_msg` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `iVoiceXP_guild_id_key`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reward` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `rol` VARCHAR(191) NOT NULL,
    `iVoiceXP_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iVoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `create_channel_id` VARCHAR(191) NOT NULL,
    `create_channel_parent_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `iVoices_guild_id_create_channel_id_key`(`guild_id`, `create_channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iTempVoiceUtils` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `channel_limit` INTEGER NULL,
    `channel_name` VARCHAR(191) NULL,
    `cmds_channel_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `iTempVoiceUtils_guild_id_channel_id_key`(`guild_id`, `channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `note` MEDIUMTEXT NOT NULL,
    `note_id` INTEGER NOT NULL,
    `perpetrator_id` VARCHAR(191) NOT NULL,
    `allowed_role_id` VARCHAR(191) NULL,
    `attachment_url` MEDIUMTEXT NULL,
    `time_unix` VARCHAR(191) NULL,
    `inotes_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Notes_note_id_key`(`note_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `channel_owner_id` VARCHAR(191) NOT NULL,
    `channel_category_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Voices_guild_id_channel_id_key`(`guild_id`, `channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoiceUsers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `VoiceUsers_guild_id_channel_id_key`(`guild_id`, `channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iUsersVoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `channel_name` VARCHAR(191) NULL,
    `channel_limit` INTEGER NULL,
    `is_channel_locked` BOOLEAN NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `iUsersVoice_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `vc_xp` INTEGER NULL DEFAULT 0,
    `vc_lvl` INTEGER NULL DEFAULT 1,
    `txt_xp` INTEGER NULL DEFAULT 0,
    `txt_lvl` INTEGER NULL DEFAULT 1,
    `total_vc_exp` INTEGER NULL DEFAULT 0,
    `total_txt_exp` INTEGER NULL DEFAULT 0,
    `total_vc_time` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Experience_guild_id_user_id_key`(`guild_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FilteredVoiceChannels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FilteredVoiceChannels_guild_id_channel_id_key`(`guild_id`, `channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Moderation` (
    `case_id` INTEGER NOT NULL AUTO_INCREMENT,
    `case_guild_id` INTEGER NOT NULL,
    `guild_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `mod_id` VARCHAR(191) NOT NULL,
    `case_type` VARCHAR(191) NOT NULL,
    `case_reason` MEDIUMTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Moderation_case_guild_id_guild_id_key`(`case_guild_id`, `guild_id`),
    PRIMARY KEY (`case_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Webhooks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `webhook_id` VARCHAR(191) NOT NULL,
    `webhook_token` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Webhooks_guild_id_key`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `iNotes` ADD CONSTRAINT `iNotes_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `iTextXP` ADD CONSTRAINT `iTextXP_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `iVoiceXP` ADD CONSTRAINT `iVoiceXP_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reward` ADD CONSTRAINT `Reward_iVoiceXP_id_fkey` FOREIGN KEY (`iVoiceXP_id`) REFERENCES `iVoiceXP`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `iVoices` ADD CONSTRAINT `iVoices_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `iTempVoiceUtils` ADD CONSTRAINT `iTempVoiceUtils_guild_id_channel_id_fkey` FOREIGN KEY (`guild_id`, `channel_id`) REFERENCES `iVoices`(`guild_id`, `create_channel_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_inotes_id_fkey` FOREIGN KEY (`inotes_id`) REFERENCES `iNotes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voices` ADD CONSTRAINT `Voices_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoiceUsers` ADD CONSTRAINT `VoiceUsers_guild_id_channel_id_fkey` FOREIGN KEY (`guild_id`, `channel_id`) REFERENCES `Voices`(`guild_id`, `channel_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FilteredVoiceChannels` ADD CONSTRAINT `FilteredVoiceChannels_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Moderation` ADD CONSTRAINT `Moderation_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Webhooks` ADD CONSTRAINT `Webhooks_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
