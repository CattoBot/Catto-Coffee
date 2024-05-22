-- AlterTable
ALTER TABLE `Users` ADD COLUMN `about_me` VARCHAR(255) NULL,
    ADD COLUMN `global_lvl` INTEGER NULL DEFAULT 1,
    ADD COLUMN `global_xp` INTEGER NULL DEFAULT 0,
    ADD COLUMN `total_global_exp` INTEGER NULL DEFAULT 0,
    ADD COLUMN `total_registered_msgs` INTEGER NULL DEFAULT 0,
    ADD COLUMN `total_vc_time` INTEGER NULL DEFAULT 0;
