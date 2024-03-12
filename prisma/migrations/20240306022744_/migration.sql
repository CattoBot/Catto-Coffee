-- AlterTable
ALTER TABLE `ActiveTempVoice` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Guild` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Moderation` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `TrustedVoiceChannelMembers` MODIFY `updated_at` DATETIME(3) NULL;
