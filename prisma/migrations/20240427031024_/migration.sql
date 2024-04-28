/*
  Warnings:

  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Experience` DROP FOREIGN KEY `Experience_guild_id_fkey`;

-- DropTable
DROP TABLE `Experience`;

-- CreateTable
CREATE TABLE `VocieExperience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `vc_xp` INTEGER NULL DEFAULT 0,
    `vc_lvl` INTEGER NULL DEFAULT 1,
    `total_vc_exp` INTEGER NULL DEFAULT 0,
    `total_vc_time` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VocieExperience_guild_id_user_id_key`(`guild_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TextExperience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `txt_xp` INTEGER NULL DEFAULT 0,
    `txt_lvl` INTEGER NULL DEFAULT 1,
    `total_txt_exp` INTEGER NULL DEFAULT 0,
    `total_txt_time` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TextExperience_guild_id_user_id_key`(`guild_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleRewards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `role_type` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `RoleRewards_guild_id_role_id_key`(`guild_id`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VocieExperience` ADD CONSTRAINT `VocieExperience_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TextExperience` ADD CONSTRAINT `TextExperience_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleRewards` ADD CONSTRAINT `RoleRewards_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
