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
    `Note` MEDIUMTEXT NOT NULL,
    `NoteID` INTEGER NOT NULL,
    `Perpetrator` VARCHAR(191) NOT NULL,
    `ReadRoleID` VARCHAR(191) NULL,
    `AttachmentURL` MEDIUMTEXT NULL,
    `Unix` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`NoteID`, `GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildsData` (
    `GuildID` VARCHAR(50) NOT NULL,
    `Prefix` CHAR(1) NOT NULL DEFAULT '!',
    `VoiceSpeedDefault` INTEGER NULL,
    `TextExperienceMin` INTEGER NULL,
    `TextExperienceMax` INTEGER NULL,
    `VoiceExperienceMin` INTEGER NULL,
    `VoiceExperienceMax` INTEGER NULL,
    `TextExpEnabled` BOOLEAN NOT NULL DEFAULT true,
    `VoiceExpEnabled` BOOLEAN NOT NULL DEFAULT true,
    `TextDefaultMessage` MEDIUMTEXT NULL,
    `VoiceDefaultMessage` MEDIUMTEXT NULL,

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
    `Nivel` INTEGER NOT NULL DEFAULT 1,
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
    `Nivel` INTEGER NOT NULL DEFAULT 1,
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
    `NotesLogs` VARCHAR(50) NULL,
    `ModLog` VARCHAR(50) NULL,
    `TextXPNotification` VARCHAR(50) NULL,
    `VcXPNotification` VARCHAR(50) NULL,
    `VoiceLogs` VARCHAR(50) NULL,

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

-- CreateTable
CREATE TABLE `CattoGalaxyUsers` (
    `UserID` VARCHAR(50) NOT NULL,
    `TutorialSteep` INTEGER NULL DEFAULT 0,
    `PremiumLevel` INTEGER NULL DEFAULT 0,
    `PremiumUpTo` VARCHAR(15) NULL,
    `Guild` VARCHAR(50) NOT NULL,
    `Description` VARCHAR(100) NULL,
    `Color` VARCHAR(50) NULL,
    `Experience` INTEGER NULL DEFAULT 0,
    `Ship` INTEGER NULL DEFAULT 0,
    `Gold_Coins` INTEGER NULL DEFAULT 0,
    `Platinum_Coins` INTEGER NULL DEFAULT 0,
    `Victories` INTEGER NULL DEFAULT 0,
    `Defeats` INTEGER NULL DEFAULT 0,
    `Draws` INTEGER NULL DEFAULT 0,
    `TotalFights` INTEGER NULL DEFAULT 0,
    `Strength` INTEGER NULL DEFAULT 0,
    `Luck` INTEGER NULL DEFAULT 0,
    `Intelligence` INTEGER NULL DEFAULT 0,
    `Reputation` INTEGER NULL DEFAULT 0,
    `HungerBoost` INTEGER NULL DEFAULT 0,
    `HealthBoost` INTEGER NULL DEFAULT 0,
    `SecurityBoost` INTEGER NULL DEFAULT 0,
    `HappinessBoost` INTEGER NULL DEFAULT 0,

    INDEX `CattoGalaxyUsers_UserID_Guild_idx`(`UserID`, `Guild`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CattoGalaxyItems` (
    `UserID` VARCHAR(50) NOT NULL,
    `ItemID` INTEGER NOT NULL,
    `Amount` INTEGER NOT NULL DEFAULT 0,
    `Wastage` INTEGER NULL DEFAULT 0,
    `StatBought` INTEGER NULL DEFAULT 0,
    `StatSold` INTEGER NULL DEFAULT 0,
    `StatUsed` INTEGER NULL DEFAULT 0,
    `StatGiven` INTEGER NULL DEFAULT 0,
    `StatReceived` INTEGER NULL DEFAULT 0,
    `StatBroken` INTEGER NULL DEFAULT 0,
    `StatRepaired` INTEGER NULL DEFAULT 0,

    INDEX `CattoGalaxyItems_UserID_ItemID_idx`(`UserID`, `ItemID`),
    PRIMARY KEY (`UserID`, `ItemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CattoGalaxyWorlds` (
    `WorldID` VARCHAR(50) NOT NULL,
    `UserID` VARCHAR(50) NOT NULL,
    `Population` INTEGER NOT NULL,
    `Type` INTEGER NOT NULL DEFAULT 0,
    `Level` INTEGER NULL DEFAULT 0,
    `Experience` INTEGER NULL DEFAULT 0,
    `Health` INTEGER NULL DEFAULT 5,
    `Hunger` INTEGER NULL DEFAULT 5,
    `Happiness` INTEGER NULL DEFAULT 5,
    `Security` INTEGER NULL DEFAULT 5,
    `Mining` INTEGER NULL DEFAULT 0,
    `Mining_level` INTEGER NULL DEFAULT 0,
    `Fishing` INTEGER NULL DEFAULT 0,
    `Fishing_level` INTEGER NULL DEFAULT 0,
    `Cooking` INTEGER NULL DEFAULT 0,
    `Cooking_Level` INTEGER NULL DEFAULT 0,
    `Trading` INTEGER NULL DEFAULT 0,
    `Trading_Level` INTEGER NULL DEFAULT 0,
    `Harvest` INTEGER NULL DEFAULT 0,
    `Harvest_Level` INTEGER NULL DEFAULT 0,
    `Crafting` INTEGER NULL DEFAULT 0,
    `Crafting_Level` INTEGER NULL DEFAULT 0,
    `Wisdom` INTEGER NULL DEFAULT 0,
    `Wisdom_Level` INTEGER NULL DEFAULT 0,
    `Army` INTEGER NULL DEFAULT 0,
    `Army_Level` INTEGER NULL DEFAULT 0,

    INDEX `CattoGalaxyWorlds_WorldID_idx`(`WorldID`),
    PRIMARY KEY (`WorldID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CattoGalaxyGuilds` (
    `GuildID` VARCHAR(50) NOT NULL,
    `Experience` INTEGER NULL DEFAULT 0,
    `Gold_Coins` INTEGER NULL DEFAULT 0,
    `Platinum_Coins` INTEGER NULL DEFAULT 0,
    `InWarWith` VARCHAR(50) NULL,
    `WarPunctuation` INTEGER NULL DEFAULT 0,

    INDEX `CattoGalaxyGuilds_GuildID_idx`(`GuildID`),
    PRIMARY KEY (`GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
