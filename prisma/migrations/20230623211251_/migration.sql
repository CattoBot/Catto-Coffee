/*
  Warnings:

  - Made the column `TextExpEnabled` on table `guildsdata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `VoiceExpEnabled` on table `guildsdata` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `guildsdata` ALTER COLUMN `VoiceExperienceMin` DROP DEFAULT,
    ALTER COLUMN `VoiceExperienceMax` DROP DEFAULT,
    MODIFY `TextExpEnabled` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `VoiceExpEnabled` BOOLEAN NOT NULL DEFAULT true;
