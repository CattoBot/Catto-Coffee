-- AlterTable
ALTER TABLE `iVoices` ADD COLUMN `channel_limit` INTEGER NULL,
    ADD COLUMN `default_channel_name` VARCHAR(191) NULL,
    ADD COLUMN `should_enumerate` BOOLEAN NULL;
