-- CreateTable
CREATE TABLE `guild` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(70) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `guild_guild_id_key`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(191) NOT NULL,
    `prefix` VARCHAR(5) NULL,
    `language` VARCHAR(5) NULL,
    `premium` BOOLEAN NULL,
    `lvl_up_chnl_id` VARCHAR(191) NULL,
    `daily_lead_chnl_id` VARCHAR(191) NULL,

    UNIQUE INDEX `config_guildId_key`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `configId` INTEGER NOT NULL,
    `txt_exp_min` INTEGER NOT NULL DEFAULT 5,
    `txt_exp_max` INTEGER NOT NULL DEFAULT 50,
    `txt_enabled` BOOLEAN NOT NULL DEFAULT false,
    `txt_exp_cd` INTEGER NOT NULL DEFAULT 60,
    `vc_exp_min` INTEGER NOT NULL DEFAULT 5,
    `vc_exp_max` INTEGER NOT NULL DEFAULT 50,
    `vc_enabled` BOOLEAN NOT NULL DEFAULT false,
    `vc_exp_cd` INTEGER NOT NULL DEFAULT 60,

    UNIQUE INDEX `exp_configId_key`(`configId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expChannelFilters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exp_id` INTEGER NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `text_disabled` BOOLEAN NOT NULL,
    `voice_disabled` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `config` ADD CONSTRAINT `config_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `guild`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exp` ADD CONSTRAINT `exp_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `config`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expChannelFilters` ADD CONSTRAINT `expChannelFilters_exp_id_fkey` FOREIGN KEY (`exp_id`) REFERENCES `exp`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
