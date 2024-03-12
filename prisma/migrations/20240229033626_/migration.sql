/*
  Warnings:

  - The primary key for the `ActiveTempVoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ChannelCategory` on the `ActiveTempVoice` table. All the data in the column will be lost.
  - You are about to drop the column `ChannelID` on the `ActiveTempVoice` table. All the data in the column will be lost.
  - You are about to drop the column `ChannelOwner` on the `ActiveTempVoice` table. All the data in the column will be lost.
  - You are about to drop the column `GuildID` on the `ActiveTempVoice` table. All the data in the column will be lost.
  - The primary key for the `Guild` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `GuildID` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `GuildLang` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `GuildPrefix` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `ModLogChannel` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `NotesLogsChannel` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `VoiceLogsChannel` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `experienceNotificationsId` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `textExperienceSettingsId` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `voiceExperienceSettingsId` on the `Guild` table. All the data in the column will be lost.
  - The primary key for the `Moderation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CaseID` on the `Moderation` table. All the data in the column will be lost.
  - You are about to drop the column `Date` on the `Moderation` table. All the data in the column will be lost.
  - You are about to drop the column `GuildID` on the `Moderation` table. All the data in the column will be lost.
  - You are about to drop the column `ModeratorID` on the `Moderation` table. All the data in the column will be lost.
  - You are about to drop the column `Reason` on the `Moderation` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `Moderation` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `Moderation` table. All the data in the column will be lost.
  - The primary key for the `TempChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `GuildID` on the `TempChannel` table. All the data in the column will be lost.
  - You are about to drop the column `TempVoiceCategory` on the `TempChannel` table. All the data in the column will be lost.
  - You are about to drop the column `TempVoiceChannelCreate` on the `TempChannel` table. All the data in the column will be lost.
  - The primary key for the `TextExperienceSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `GuildID` on the `TextExperienceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `TextDefaultMessage` on the `TextExperienceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `TextExpEnabled` on the `TextExperienceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `TextExperienceMax` on the `TextExperienceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `TextExperienceMin` on the `TextExperienceSettings` table. All the data in the column will be lost.
  - The primary key for the `UsersTempVoiceConfiguration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ChannelLimit` on the `UsersTempVoiceConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `ChannelName` on the `UsersTempVoiceConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `IsLocked` on the `UsersTempVoiceConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `UsersTempVoiceConfiguration` table. All the data in the column will be lost.
  - The primary key for the `VoiceExperienceSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `GuildID` on the `VoiceExperienceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `VoiceDefaultMessage` on the `VoiceExperienceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `VoiceExpEnabled` on the `VoiceExperienceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `VoiceExperienceMax` on the `VoiceExperienceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `VoiceExperienceMin` on the `VoiceExperienceSettings` table. All the data in the column will be lost.
  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExperienceNotifications` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[guild_id,channel_category_id]` on the table `TempChannel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channel_category_id` to the `ActiveTempVoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channel_id` to the `ActiveTempVoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channel_owner_id` to the `ActiveTempVoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `ActiveTempVoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `Guild` table without a default value. This is not possible if the table is not empty.
  - Added the required column `case_date` to the `Moderation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `case_id` to the `Moderation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `case_reason` to the `Moderation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `case_type` to the `Moderation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `Moderation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mod_id` to the `Moderation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Moderation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channel_category_id` to the `TempChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channel_create_id` to the `TempChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `TempChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `TextExperienceSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_text_exp_enabled` to the `TextExperienceSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UsersTempVoiceConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `VoiceExperienceSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_voice_exp_enabled` to the `VoiceExperienceSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ActiveTempVoice` DROP FOREIGN KEY `ActiveTempVoice_GuildID_ChannelCategory_fkey`;

-- DropForeignKey
ALTER TABLE `ActiveTempVoice` DROP FOREIGN KEY `ActiveTempVoice_GuildID_fkey`;

-- DropForeignKey
ALTER TABLE `Experience` DROP FOREIGN KEY `Experience_GuildID_fkey`;

-- DropForeignKey
ALTER TABLE `Guild` DROP FOREIGN KEY `Guild_experienceNotificationsId_fkey`;

-- DropForeignKey
ALTER TABLE `Guild` DROP FOREIGN KEY `Guild_textExperienceSettingsId_fkey`;

-- DropForeignKey
ALTER TABLE `Guild` DROP FOREIGN KEY `Guild_voiceExperienceSettingsId_fkey`;

-- DropForeignKey
ALTER TABLE `Moderation` DROP FOREIGN KEY `Moderation_GuildID_fkey`;

-- DropForeignKey
ALTER TABLE `TempChannel` DROP FOREIGN KEY `TempChannel_GuildID_fkey`;

-- DropIndex
DROP INDEX `ActiveTempVoice_GuildID_ChannelOwner_ChannelCategory_idx` ON `ActiveTempVoice`;

-- DropIndex
DROP INDEX `Guild_GuildPrefix_idx` ON `Guild`;

-- DropIndex
DROP INDEX `TempChannel_GuildID_TempVoiceCategory_key` ON `TempChannel`;

-- DropIndex
DROP INDEX `TextExperienceSettings_GuildID_idx` ON `TextExperienceSettings`;

-- DropIndex
DROP INDEX `VoiceExperienceSettings_GuildID_idx` ON `VoiceExperienceSettings`;

-- AlterTable
ALTER TABLE `ActiveTempVoice` DROP PRIMARY KEY,
    DROP COLUMN `ChannelCategory`,
    DROP COLUMN `ChannelID`,
    DROP COLUMN `ChannelOwner`,
    DROP COLUMN `GuildID`,
    ADD COLUMN `channel_category_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `channel_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `channel_owner_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `guild_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`channel_id`, `guild_id`);

-- AlterTable
ALTER TABLE `Guild` DROP PRIMARY KEY,
    DROP COLUMN `GuildID`,
    DROP COLUMN `GuildLang`,
    DROP COLUMN `GuildPrefix`,
    DROP COLUMN `ModLogChannel`,
    DROP COLUMN `NotesLogsChannel`,
    DROP COLUMN `VoiceLogsChannel`,
    DROP COLUMN `experienceNotificationsId`,
    DROP COLUMN `textExperienceSettingsId`,
    DROP COLUMN `voiceExperienceSettingsId`,
    ADD COLUMN `exp_notify_id` INTEGER NULL,
    ADD COLUMN `guild_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `guild_lang` VARCHAR(191) NULL,
    ADD COLUMN `guild_prefix` VARCHAR(191) NULL,
    ADD COLUMN `mod_log_channel` VARCHAR(191) NULL,
    ADD COLUMN `notes_log_channel` VARCHAR(191) NULL,
    ADD COLUMN `txt_exp_settings_id` INTEGER NULL,
    ADD COLUMN `vc_exp_settings_id` INTEGER NULL,
    ADD COLUMN `voice_logs_channel` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`guild_id`);

-- AlterTable
ALTER TABLE `Moderation` DROP PRIMARY KEY,
    DROP COLUMN `CaseID`,
    DROP COLUMN `Date`,
    DROP COLUMN `GuildID`,
    DROP COLUMN `ModeratorID`,
    DROP COLUMN `Reason`,
    DROP COLUMN `Type`,
    DROP COLUMN `UserID`,
    ADD COLUMN `case_date` DATETIME(3) NOT NULL,
    ADD COLUMN `case_id` INTEGER NOT NULL,
    ADD COLUMN `case_reason` VARCHAR(191) NOT NULL,
    ADD COLUMN `case_type` VARCHAR(191) NOT NULL,
    ADD COLUMN `guild_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `mod_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`case_id`);

-- AlterTable
ALTER TABLE `TempChannel` DROP PRIMARY KEY,
    DROP COLUMN `GuildID`,
    DROP COLUMN `TempVoiceCategory`,
    DROP COLUMN `TempVoiceChannelCreate`,
    ADD COLUMN `channel_category_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `channel_create_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `guild_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`channel_create_id`, `guild_id`, `channel_category_id`);

-- AlterTable
ALTER TABLE `TextExperienceSettings` DROP PRIMARY KEY,
    DROP COLUMN `GuildID`,
    DROP COLUMN `TextDefaultMessage`,
    DROP COLUMN `TextExpEnabled`,
    DROP COLUMN `TextExperienceMax`,
    DROP COLUMN `TextExperienceMin`,
    ADD COLUMN `guild_id` INTEGER NOT NULL,
    ADD COLUMN `is_text_exp_enabled` BOOLEAN NOT NULL,
    ADD COLUMN `text_default_levelup_message` VARCHAR(191) NULL,
    ADD COLUMN `text_experience_max` INTEGER NULL,
    ADD COLUMN `text_experience_min` INTEGER NULL,
    ADD PRIMARY KEY (`guild_id`);

-- AlterTable
ALTER TABLE `UsersTempVoiceConfiguration` DROP PRIMARY KEY,
    DROP COLUMN `ChannelLimit`,
    DROP COLUMN `ChannelName`,
    DROP COLUMN `IsLocked`,
    DROP COLUMN `UserID`,
    ADD COLUMN `channel_limit` INTEGER NULL,
    ADD COLUMN `channel_name` VARCHAR(191) NULL,
    ADD COLUMN `is_channel_locked` BOOLEAN NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- AlterTable
ALTER TABLE `VoiceExperienceSettings` DROP PRIMARY KEY,
    DROP COLUMN `GuildID`,
    DROP COLUMN `VoiceDefaultMessage`,
    DROP COLUMN `VoiceExpEnabled`,
    DROP COLUMN `VoiceExperienceMax`,
    DROP COLUMN `VoiceExperienceMin`,
    ADD COLUMN `guild_id` INTEGER NOT NULL,
    ADD COLUMN `is_voice_exp_enabled` BOOLEAN NOT NULL,
    ADD COLUMN `voice_default_levelup_message` VARCHAR(191) NULL,
    ADD COLUMN `voice_experience_max` INTEGER NULL,
    ADD COLUMN `voice_experience_min` INTEGER NULL,
    ADD PRIMARY KEY (`guild_id`);

-- DropTable
DROP TABLE `Experience`;

-- DropTable
DROP TABLE `ExperienceNotifications`;

-- CreateTable
CREATE TABLE `Users` (
    `user_id` VARCHAR(191) NOT NULL,
    `total_used_commands` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersExperience` (
    `user_id` VARCHAR(191) NOT NULL,
    `guild_id` VARCHAR(191) NOT NULL,
    `vc_exp` INTEGER NOT NULL,
    `text_exp` INTEGER NOT NULL,
    `vc_level` INTEGER NOT NULL,
    `text_level` INTEGER NOT NULL,
    `total_exp` INTEGER NOT NULL,

    INDEX `UsersExperience_guild_id_idx`(`guild_id`),
    PRIMARY KEY (`user_id`, `guild_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ActiveTempVoice_guild_id_channel_owner_id_channel_category_i_idx` ON `ActiveTempVoice`(`guild_id`, `channel_owner_id`, `channel_category_id`);

-- CreateIndex
CREATE INDEX `Guild_guild_id_idx` ON `Guild`(`guild_id`);

-- CreateIndex
CREATE INDEX `Moderation_guild_id_idx` ON `Moderation`(`guild_id`);

-- CreateIndex
CREATE INDEX `TempChannel_guild_id_idx` ON `TempChannel`(`guild_id`);

-- CreateIndex
CREATE UNIQUE INDEX `TempChannel_guild_id_channel_category_id_key` ON `TempChannel`(`guild_id`, `channel_category_id`);

-- CreateIndex
CREATE INDEX `TextExperienceSettings_guild_id_idx` ON `TextExperienceSettings`(`guild_id`);

-- CreateIndex
CREATE INDEX `VoiceExperienceSettings_guild_id_idx` ON `VoiceExperienceSettings`(`guild_id`);

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_txt_exp_settings_id_fkey` FOREIGN KEY (`txt_exp_settings_id`) REFERENCES `TextExperienceSettings`(`guild_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_vc_exp_settings_id_fkey` FOREIGN KEY (`vc_exp_settings_id`) REFERENCES `VoiceExperienceSettings`(`guild_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TempChannel` ADD CONSTRAINT `TempChannel_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Moderation` ADD CONSTRAINT `Moderation_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveTempVoice` ADD CONSTRAINT `ActiveTempVoice_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveTempVoice` ADD CONSTRAINT `ActiveTempVoice_guild_id_channel_category_id_fkey` FOREIGN KEY (`guild_id`, `channel_category_id`) REFERENCES `TempChannel`(`guild_id`, `channel_category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersTempVoiceConfiguration` ADD CONSTRAINT `UsersTempVoiceConfiguration_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersExperience` ADD CONSTRAINT `UsersExperience_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
