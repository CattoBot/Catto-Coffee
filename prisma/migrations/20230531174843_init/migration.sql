-- AlterTable
ALTER TABLE `guildsdata` ADD COLUMN `TextExperienceMax` INTEGER NOT NULL DEFAULT 10,
    ADD COLUMN `TextExperienceMin` INTEGER NOT NULL DEFAULT 5;

-- CreateIndex
CREATE INDEX `GuildsData_GuildID_idx` ON `GuildsData`(`GuildID`);
