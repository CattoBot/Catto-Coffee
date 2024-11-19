/*
  Warnings:

  - A unique constraint covering the columns `[channelId]` on the table `i_voice_temp_channels` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `IDX_I_VOICE_TEMP_CHANNELS_GUILD_ID_CHANNEL_ID` ON `i_voice_temp_channels`;

-- CreateTable
CREATE TABLE `PermittedVoiceRoles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `roleId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `PermittedVoiceRoles_guildId_roleId_channelId_key`(`guildId`, `roleId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `i_voice_temp_channels_channelId_key` ON `i_voice_temp_channels`(`channelId`);

-- AddForeignKey
ALTER TABLE `PermittedVoiceRoles` ADD CONSTRAINT `PermittedVoiceRoles_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `guilds`(`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermittedVoiceRoles` ADD CONSTRAINT `PermittedVoiceRoles_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `i_voice_temp_channels`(`channelId`) ON DELETE RESTRICT ON UPDATE CASCADE;
