-- CreateTable
CREATE TABLE `GuildsData` (
    `GuildID` VARCHAR(191) NOT NULL,
    `Prefix` VARCHAR(191) NOT NULL DEFAULT '!',
    `VoiceSpeedDefault` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersData` (
    `UserID` VARCHAR(191) NOT NULL,
    `UserVoiceRankCardColor` VARCHAR(191) NULL,
    `UserTextRankCardColor` VARCHAR(191) NULL,
    `UserVoiceRankCardBackground` VARCHAR(191) NULL,
    `UserTextRankCardBackground` VARCHAR(191) NULL,

    INDEX `UsersData_UserID_idx`(`UserID`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersVoiceExperienceData` (
    `UserID` VARCHAR(191) NOT NULL,
    `GuildID` VARCHAR(191) NOT NULL,
    `VoiceExperience` INTEGER NOT NULL DEFAULT 0,
    `Nivel` INTEGER NOT NULL DEFAULT 0,
    `TotalExperience` INTEGER NOT NULL DEFAULT 0,

    INDEX `UsersVoiceExperienceData_UserID_idx`(`UserID`),
    INDEX `UsersVoiceExperienceData_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`UserID`, `GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoiceRoleRewards` (
    `GuildID` VARCHAR(191) NOT NULL,
    `Nivel` INTEGER NOT NULL,
    `RoleID` VARCHAR(191) NOT NULL,

    INDEX `VoiceRoleRewards_GuildID_idx`(`GuildID`),
    INDEX `VoiceRoleRewards_RoleID_idx`(`RoleID`),
    PRIMARY KEY (`GuildID`, `RoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersTextExperienceData` (
    `UserID` VARCHAR(191) NOT NULL,
    `GuildID` VARCHAR(191) NOT NULL,
    `TextExperience` INTEGER NOT NULL DEFAULT 0,
    `Nivel` INTEGER NOT NULL DEFAULT 0,
    `TotalExperience` INTEGER NOT NULL DEFAULT 0,

    INDEX `UsersTextExperienceData_UserID_idx`(`UserID`),
    INDEX `UsersTextExperienceData_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`UserID`, `GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TextRoleRewards` (
    `GuildID` VARCHAR(191) NOT NULL,
    `Nivel` INTEGER NOT NULL,
    `RoleID` VARCHAR(191) NOT NULL,

    INDEX `TextRoleRewards_GuildID_idx`(`GuildID`),
    INDEX `TextRoleRewards_RoleID_idx`(`RoleID`),
    PRIMARY KEY (`GuildID`, `RoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersEconomyVoiceRewards` (
    `UserID` VARCHAR(191) NOT NULL,
    `GuildID` VARCHAR(191) NOT NULL,
    `Coins` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`UserID`, `GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActiveTempVoices` (
    `GuildID` VARCHAR(191) NOT NULL,
    `ChannelID` VARCHAR(191) NOT NULL,
    `ChannelOwner` VARCHAR(191) NOT NULL,
    `ChannelCategory` VARCHAR(191) NULL,

    INDEX `ActiveTempVoices_GuildID_idx`(`GuildID`),
    INDEX `ActiveTempVoices_ChannelID_idx`(`ChannelID`),
    PRIMARY KEY (`GuildID`, `ChannelID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConfigChannels` (
    `GuildID` VARCHAR(191) NOT NULL,
    `NotesLogs` VARCHAR(191) NULL,
    `ModLog` VARCHAR(191) NULL,
    `TextXPNotification` VARCHAR(191) NULL,
    `VcXPNotification` VARCHAR(191) NULL,
    `VoiceLogs` VARCHAR(191) NULL,

    INDEX `ConfigChannels_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Moderation` (
    `GuildID` VARCHAR(191) NOT NULL,
    `UserID` VARCHAR(191) NOT NULL,
    `ModeratorID` VARCHAR(191) NOT NULL,
    `CaseID` INTEGER NOT NULL,
    `Type` VARCHAR(191) NOT NULL,
    `Reason` VARCHAR(191) NULL,
    `Date` DATETIME(3) NOT NULL,

    INDEX `Moderation_GuildID_idx`(`GuildID`),
    INDEX `Moderation_CaseID_idx`(`CaseID`),
    PRIMARY KEY (`GuildID`, `CaseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
