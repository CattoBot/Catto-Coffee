/*
  Warnings:

  - You are about to drop the `TempChannel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `ActiveTempVoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Guild` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Moderation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ActiveTempVoice` DROP FOREIGN KEY `ActiveTempVoice_guild_id_channel_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `TempChannel` DROP FOREIGN KEY `TempChannel_guild_id_fkey`;

-- DropForeignKey
ALTER TABLE `UsersTempVoiceConfiguration` DROP FOREIGN KEY `UsersTempVoiceConfiguration_user_id_fkey`;

-- DropIndex
DROP INDEX `ActiveTempVoice_guild_id_channel_owner_id_channel_category_i_idx` ON `ActiveTempVoice`;

-- AlterTable
ALTER TABLE `ActiveTempVoice` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Guild` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Moderation` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `TempChannel`;

-- DropTable
DROP TABLE `Users`;

-- CreateTable
CREATE TABLE `TempChannelSettings` (
    `channel_create_id` VARCHAR(191) NOT NULL,
    `guild_id` VARCHAR(191) NOT NULL,
    `channel_category_id` VARCHAR(191) NOT NULL,
    `category_name` VARCHAR(191) NULL,
    `channel_limit` INTEGER NULL,
    `channel_name` VARCHAR(191) NULL,

    INDEX `TempChannelSettings_guild_id_idx`(`guild_id`),
    UNIQUE INDEX `TempChannelSettings_guild_id_channel_category_id_key`(`guild_id`, `channel_category_id`),
    PRIMARY KEY (`channel_create_id`, `guild_id`, `channel_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrustedVoiceChannelMembers` (
    `channel_id` VARCHAR(191) NOT NULL,
    `guild_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `channel_owner_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ActiveTempVoice_channel_id_guild_id_idx` ON `ActiveTempVoice`(`channel_id`, `guild_id`);

-- CreateIndex
CREATE INDEX `Moderation_case_id_idx` ON `Moderation`(`case_id`);

-- CreateIndex
CREATE INDEX `UsersExperience_user_id_guild_id_idx` ON `UsersExperience`(`user_id`, `guild_id`);

-- CreateIndex
CREATE INDEX `UsersTempVoiceConfiguration_user_id_idx` ON `UsersTempVoiceConfiguration`(`user_id`);

-- AddForeignKey
ALTER TABLE `TempChannelSettings` ADD CONSTRAINT `TempChannelSettings_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveTempVoice` ADD CONSTRAINT `ActiveTempVoice_guild_id_channel_category_id_fkey` FOREIGN KEY (`guild_id`, `channel_category_id`) REFERENCES `TempChannelSettings`(`guild_id`, `channel_category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrustedVoiceChannelMembers` ADD CONSTRAINT `TrustedVoiceChannelMembers_channel_id_guild_id_fkey` FOREIGN KEY (`channel_id`, `guild_id`) REFERENCES `ActiveTempVoice`(`channel_id`, `guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
