-- AlterTable
ALTER TABLE `activetempvoices` MODIFY `ChannelOwner` VARCHAR(50) NULL,
    MODIFY `ChannelCategory` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `configchannels` MODIFY `NotesLogs` VARCHAR(50) NULL,
    MODIFY `ModLog` VARCHAR(50) NULL,
    MODIFY `TextXPNotification` VARCHAR(50) NULL,
    MODIFY `VcXPNotification` VARCHAR(50) NULL,
    MODIFY `VoiceLogs` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `moderation` MODIFY `UserID` VARCHAR(50) NULL,
    MODIFY `ModeratorID` VARCHAR(50) NULL,
    MODIFY `Type` VARCHAR(50) NULL,
    MODIFY `Reason` MEDIUMTEXT NULL,
    MODIFY `Date` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `textrolerewards` MODIFY `Nivel` INTEGER NULL;

-- AlterTable
ALTER TABLE `userseconomyvoicerewards` MODIFY `Coins` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `userstextexperiencedata` MODIFY `TextExperience` INTEGER NULL DEFAULT 0,
    MODIFY `Nivel` INTEGER NULL DEFAULT 0,
    MODIFY `TotalExperience` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `usersvoiceexperiencedata` MODIFY `VoiceExperience` INTEGER NULL DEFAULT 0,
    MODIFY `Nivel` INTEGER NULL DEFAULT 0,
    MODIFY `TotalExperience` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `voicerolerewards` MODIFY `Nivel` INTEGER NULL;
