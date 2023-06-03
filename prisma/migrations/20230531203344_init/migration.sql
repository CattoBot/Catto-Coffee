-- AlterTable
ALTER TABLE `guildsdata` ADD COLUMN `TextExpEnabled` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `VoiceExpEnabled` BOOLEAN NOT NULL DEFAULT true;
