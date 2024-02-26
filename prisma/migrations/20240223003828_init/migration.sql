-- CreateTable
CREATE TABLE `Guild` (
    `GuildID` VARCHAR(191) NOT NULL,
    `GuildPrefix` VARCHAR(191) NULL,
    `GuildLang` VARCHAR(191) NULL,
    `NotesLogsChannel` VARCHAR(191) NULL,
    `ModLogChannel` VARCHAR(191) NULL,
    `VoiceLogsChannel` VARCHAR(191) NULL,
    `textExperienceSettingsId` INTEGER NULL,
    `voiceExperienceSettingsId` INTEGER NULL,
    `experienceNotificationsId` INTEGER NULL,

    INDEX `Guild_GuildPrefix_idx`(`GuildPrefix`),
    PRIMARY KEY (`GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TextExperienceSettings` (
    `GuildID` INTEGER NOT NULL,
    `TextExperienceMin` INTEGER NULL,
    `TextExperienceMax` INTEGER NULL,
    `TextExpEnabled` BOOLEAN NOT NULL,
    `TextDefaultMessage` VARCHAR(191) NULL,

    INDEX `TextExperienceSettings_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoiceExperienceSettings` (
    `GuildID` INTEGER NOT NULL,
    `VoiceExperienceMin` INTEGER NULL,
    `VoiceExperienceMax` INTEGER NULL,
    `VoiceExpEnabled` BOOLEAN NOT NULL,
    `VoiceDefaultMessage` VARCHAR(191) NULL,

    INDEX `VoiceExperienceSettings_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceNotifications` (
    `GuildID` INTEGER NOT NULL,
    `TextExperienceNotification` VARCHAR(191) NULL,
    `VoiceExperienceNotification` VARCHAR(191) NULL,

    INDEX `ExperienceNotifications_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TempChannel` (
    `TempVoiceChannelCreate` VARCHAR(191) NOT NULL,
    `GuildID` VARCHAR(191) NOT NULL,
    `TempVoiceCategory` VARCHAR(191) NOT NULL,

    INDEX `TempChannel_GuildID_idx`(`GuildID`),
    UNIQUE INDEX `TempChannel_GuildID_TempVoiceCategory_key`(`GuildID`, `TempVoiceCategory`),
    PRIMARY KEY (`TempVoiceChannelCreate`, `GuildID`, `TempVoiceCategory`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `UserID` INTEGER NOT NULL,
    `GuildID` VARCHAR(191) NOT NULL,
    `VoiceExperience` INTEGER NOT NULL,
    `TextExperience` INTEGER NOT NULL,
    `VoiceLevel` INTEGER NOT NULL,
    `TextLevel` INTEGER NOT NULL,
    `TotalExperience` INTEGER NOT NULL,

    INDEX `Experience_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`UserID`, `GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Moderation` (
    `CaseID` INTEGER NOT NULL,
    `GuildID` VARCHAR(191) NOT NULL,
    `UserID` VARCHAR(191) NOT NULL,
    `ModeratorID` VARCHAR(191) NOT NULL,
    `Type` VARCHAR(191) NOT NULL,
    `Reason` VARCHAR(191) NOT NULL,
    `Date` DATETIME(3) NOT NULL,

    INDEX `Moderation_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`CaseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActiveTempVoice` (
    `ChannelID` VARCHAR(191) NOT NULL,
    `GuildID` VARCHAR(191) NOT NULL,
    `ChannelOwner` VARCHAR(191) NOT NULL,
    `ChannelCategory` VARCHAR(191) NOT NULL,

    INDEX `ActiveTempVoice_GuildID_ChannelOwner_ChannelCategory_idx`(`GuildID`, `ChannelOwner`, `ChannelCategory`),
    PRIMARY KEY (`ChannelID`, `GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersTempVoiceConfiguration` (
    `UserID` VARCHAR(191) NOT NULL,
    `ChannelName` VARCHAR(191) NULL,
    `ChannelLimit` INTEGER NULL,
    `IsLocked` BOOLEAN NULL,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_textExperienceSettingsId_fkey` FOREIGN KEY (`textExperienceSettingsId`) REFERENCES `TextExperienceSettings`(`GuildID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_voiceExperienceSettingsId_fkey` FOREIGN KEY (`voiceExperienceSettingsId`) REFERENCES `VoiceExperienceSettings`(`GuildID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_experienceNotificationsId_fkey` FOREIGN KEY (`experienceNotificationsId`) REFERENCES `ExperienceNotifications`(`GuildID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TempChannel` ADD CONSTRAINT `TempChannel_GuildID_fkey` FOREIGN KEY (`GuildID`) REFERENCES `Guild`(`GuildID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_GuildID_fkey` FOREIGN KEY (`GuildID`) REFERENCES `Guild`(`GuildID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Moderation` ADD CONSTRAINT `Moderation_GuildID_fkey` FOREIGN KEY (`GuildID`) REFERENCES `Guild`(`GuildID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveTempVoice` ADD CONSTRAINT `ActiveTempVoice_GuildID_fkey` FOREIGN KEY (`GuildID`) REFERENCES `Guild`(`GuildID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveTempVoice` ADD CONSTRAINT `ActiveTempVoice_GuildID_ChannelCategory_fkey` FOREIGN KEY (`GuildID`, `ChannelCategory`) REFERENCES `TempChannel`(`GuildID`, `TempVoiceCategory`) ON DELETE RESTRICT ON UPDATE CASCADE;
