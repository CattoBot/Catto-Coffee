/*
  Warnings:

  - Made the column `ChannelOwner` on table `activetempvoices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ChannelCategory` on table `activetempvoices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `NotesLogs` on table `configchannels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ModLog` on table `configchannels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `TextXPNotification` on table `configchannels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `VcXPNotification` on table `configchannels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `VoiceLogs` on table `configchannels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Prefix` on table `guildsdata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `UserID` on table `moderation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ModeratorID` on table `moderation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Type` on table `moderation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Reason` on table `moderation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Date` on table `moderation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Nivel` on table `textrolerewards` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Coins` on table `userseconomyvoicerewards` required. This step will fail if there are existing NULL values in that column.
  - Made the column `TextExperience` on table `userstextexperiencedata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Nivel` on table `userstextexperiencedata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `TotalExperience` on table `userstextexperiencedata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `VoiceExperience` on table `usersvoiceexperiencedata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Nivel` on table `usersvoiceexperiencedata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `TotalExperience` on table `usersvoiceexperiencedata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Nivel` on table `voicerolerewards` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `activetempvoices` MODIFY `ChannelOwner` VARCHAR(50) NOT NULL,
    MODIFY `ChannelCategory` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `configchannels` MODIFY `NotesLogs` VARCHAR(50) NOT NULL,
    MODIFY `ModLog` VARCHAR(50) NOT NULL,
    MODIFY `TextXPNotification` VARCHAR(50) NOT NULL,
    MODIFY `VcXPNotification` VARCHAR(50) NOT NULL,
    MODIFY `VoiceLogs` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `guildsdata` MODIFY `Prefix` CHAR(1) NOT NULL DEFAULT '!';

-- AlterTable
ALTER TABLE `moderation` MODIFY `UserID` VARCHAR(50) NOT NULL,
    MODIFY `ModeratorID` VARCHAR(50) NOT NULL,
    MODIFY `Type` VARCHAR(50) NOT NULL,
    MODIFY `Reason` MEDIUMTEXT NOT NULL,
    MODIFY `Date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `textrolerewards` MODIFY `Nivel` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `userseconomyvoicerewards` MODIFY `Coins` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `userstextexperiencedata` MODIFY `TextExperience` INTEGER NOT NULL DEFAULT 0,
    MODIFY `Nivel` INTEGER NOT NULL DEFAULT 0,
    MODIFY `TotalExperience` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `usersvoiceexperiencedata` MODIFY `VoiceExperience` INTEGER NOT NULL DEFAULT 0,
    MODIFY `Nivel` INTEGER NOT NULL DEFAULT 0,
    MODIFY `TotalExperience` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `voicerolerewards` MODIFY `Nivel` INTEGER NOT NULL;
