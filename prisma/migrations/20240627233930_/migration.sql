-- AlterTable
ALTER TABLE `bonus_text_roles` ADD COLUMN `bonus` INTEGER NOT NULL DEFAULT 15;

-- AlterTable
ALTER TABLE `bonus_txt_channels` ADD COLUMN `bonus` INTEGER NOT NULL DEFAULT 15;

-- AlterTable
ALTER TABLE `bonus_voice_channels` ADD COLUMN `bonus` INTEGER NOT NULL DEFAULT 15;

-- AlterTable
ALTER TABLE `daily_top` ADD COLUMN `lastDailyTextMessageId` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `leaderboard_channels` ADD COLUMN `dailyTextTop10channelId` VARCHAR(255) NULL,
    ADD COLUMN `monthlyTextTop10channelId` VARCHAR(255) NULL,
    ADD COLUMN `weeklyTextTop10channelId` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `monthly_top` ADD COLUMN `lastMonthlyTextMessageId` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `text_experience` ADD COLUMN `totalMessages` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `weekly_top` ADD COLUMN `lastWeeklyTextMessageId` VARCHAR(255) NULL;
