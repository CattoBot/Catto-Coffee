-- AlterTable
ALTER TABLE `guildsdata` MODIFY `VoiceSpeedDefault` INTEGER NOT NULL DEFAULT 60;

-- CreateTable
CREATE TABLE `ConfigTempChannels` (
    `GuildID` VARCHAR(191) NOT NULL,
    `TempVoiceChannelCreate` VARCHAR(191) NOT NULL,
    `TempVoiceCategory` VARCHAR(191) NOT NULL,

    INDEX `ConfigTempChannels_GuildID_idx`(`GuildID`),
    INDEX `ConfigTempChannels_TempVoiceChannelCreate_idx`(`TempVoiceChannelCreate`),
    PRIMARY KEY (`GuildID`, `TempVoiceChannelCreate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
