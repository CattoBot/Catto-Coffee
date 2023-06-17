-- CreateTable
CREATE TABLE `UsersData` (
    `UserID` VARCHAR(50) NOT NULL,
    `UserVoiceRankCardColor` VARCHAR(191) NULL,
    `UserTextRankCardColor` VARCHAR(191) NULL,
    `UserVoiceRankCardBackground` VARCHAR(191) NULL,
    `UserTextRankCardBackground` VARCHAR(191) NULL,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserNotes` (
    `UserID` VARCHAR(191) NOT NULL,
    `GuildID` VARCHAR(191) NOT NULL,
<<<<<<<< HEAD:prisma/migrations/20230605172201_init/migration.sql
    `Note` VARCHAR(65535) NOT NULL,
========
    `Note` MEDIUMTEXT NOT NULL,
>>>>>>>> origin/development:prisma/migrations/20230616053220_init/migration.sql
    `NoteID` INTEGER NOT NULL,
    `Perpetrator` VARCHAR(191) NOT NULL,
    `ReadRoleID` VARCHAR(191) NULL,
    `AttachmentURL` VARCHAR(191) NULL,
    `Unix` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`NoteID`, `GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildsData` (
    `GuildID` VARCHAR(50) NOT NULL,
    `Prefix` CHAR(1) NOT NULL DEFAULT '!',
    `VoiceSpeedDefault` INTEGER NOT NULL,
    `TextExperienceMin` INTEGER NOT NULL,
    `TextExperienceMax` INTEGER NOT NULL,
    `VoiceExperienceMin` INTEGER NOT NULL DEFAULT 5,
    `VoiceExperienceMax` INTEGER NOT NULL DEFAULT 20,
    `TextExpEnabled` BOOLEAN NOT NULL DEFAULT true,
    `VoiceExpEnabled` BOOLEAN NOT NULL DEFAULT true,
    `TextDefaultMessage` MEDIUMTEXT NOT NULL,
    `VoiceDefaultMessage` MEDIUMTEXT NOT NULL,

    INDEX `GuildsData_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConfigTempChannels` (
    `GuildID` VARCHAR(30) NOT NULL,
    `TempVoiceChannelCreate` VARCHAR(30) NOT NULL,
    `TempVoiceCategory` VARCHAR(30) NOT NULL,

    INDEX `ConfigTempChannels_GuildID_idx`(`GuildID`),
    INDEX `ConfigTempChannels_TempVoiceChannelCreate_idx`(`TempVoiceChannelCreate`),
    PRIMARY KEY (`GuildID`, `TempVoiceCategory`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersVoiceExperienceData` (
    `UserID` VARCHAR(50) NOT NULL,
    `GuildID` VARCHAR(50) NOT NULL,
    `VoiceExperience` INTEGER NOT NULL DEFAULT 0,
    `Nivel` INTEGER NOT NULL DEFAULT 0,
    `TotalExperience` INTEGER NOT NULL DEFAULT 0,

    INDEX `UsersVoiceExperienceData_UserID_idx`(`UserID`),
    INDEX `UsersVoiceExperienceData_GuildID_idx`(`GuildID`),
    INDEX `UsersVoiceExperienceData_Nivel_idx`(`Nivel`),
    INDEX `UsersVoiceExperienceData_VoiceExperience_idx`(`VoiceExperience`),
    INDEX `UsersVoiceExperienceData_TotalExperience_idx`(`TotalExperience`),
    PRIMARY KEY (`UserID`, `GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoiceRoleRewards` (
    `GuildID` VARCHAR(50) NOT NULL,
    `Nivel` INTEGER NOT NULL,
    `RoleID` VARCHAR(50) NOT NULL,

    INDEX `VoiceRoleRewards_GuildID_idx`(`GuildID`),
    INDEX `VoiceRoleRewards_RoleID_idx`(`RoleID`),
    PRIMARY KEY (`GuildID`, `RoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersTextExperienceData` (
    `UserID` VARCHAR(50) NOT NULL,
    `GuildID` VARCHAR(50) NOT NULL,
    `TextExperience` INTEGER NOT NULL DEFAULT 0,
    `Nivel` INTEGER NOT NULL DEFAULT 0,
    `TotalExperience` INTEGER NOT NULL DEFAULT 0,

    INDEX `UsersTextExperienceData_UserID_idx`(`UserID`),
    INDEX `UsersTextExperienceData_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`UserID`, `GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TextRoleRewards` (
    `GuildID` VARCHAR(50) NOT NULL,
    `Nivel` INTEGER NOT NULL,
    `RoleID` VARCHAR(50) NOT NULL,

    INDEX `TextRoleRewards_GuildID_idx`(`GuildID`),
    INDEX `TextRoleRewards_RoleID_idx`(`RoleID`),
    PRIMARY KEY (`GuildID`, `RoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersEconomyVoiceRewards` (
    `UserID` VARCHAR(50) NOT NULL,
    `GuildID` VARCHAR(50) NOT NULL,
    `Coins` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`UserID`, `GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActiveTempVoices` (
    `GuildID` VARCHAR(50) NOT NULL,
    `ChannelID` VARCHAR(50) NOT NULL,
    `ChannelOwner` VARCHAR(50) NOT NULL,
    `ChannelCategory` VARCHAR(50) NOT NULL,

    INDEX `ActiveTempVoices_GuildID_idx`(`GuildID`),
    INDEX `ActiveTempVoices_ChannelID_idx`(`ChannelID`),
    INDEX `ActiveTempVoices_ChannelOwner_idx`(`ChannelOwner`),
    INDEX `ActiveTempVoices_ChannelCategory_idx`(`ChannelCategory`),
    PRIMARY KEY (`GuildID`, `ChannelID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConfigChannels` (
    `GuildID` VARCHAR(50) NOT NULL,
    `NotesLogs` VARCHAR(50) NOT NULL,
    `ModLog` VARCHAR(50) NOT NULL,
    `TextXPNotification` VARCHAR(50) NOT NULL,
    `VcXPNotification` VARCHAR(50) NOT NULL,
    `VoiceLogs` VARCHAR(50) NOT NULL,

    INDEX `ConfigChannels_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Moderation` (
    `GuildID` VARCHAR(50) NOT NULL,
    `UserID` VARCHAR(50) NOT NULL,
    `ModeratorID` VARCHAR(50) NOT NULL,
    `CaseID` INTEGER NOT NULL,
    `Type` VARCHAR(50) NOT NULL,
    `Reason` MEDIUMTEXT NOT NULL,
    `Date` DATETIME(3) NOT NULL,

    INDEX `Moderation_GuildID_idx`(`GuildID`),
    INDEX `Moderation_CaseID_idx`(`CaseID`),
    PRIMARY KEY (`GuildID`, `CaseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
