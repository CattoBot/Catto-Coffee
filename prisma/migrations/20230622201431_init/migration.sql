-- AlterTable
ALTER TABLE `guildsdata` MODIFY `Prefix` CHAR(1) NULL DEFAULT '!',
    MODIFY `VoiceSpeedDefault` INTEGER NULL,
    MODIFY `TextExperienceMin` INTEGER NULL,
    MODIFY `TextExperienceMax` INTEGER NULL,
    MODIFY `VoiceExperienceMin` INTEGER NULL DEFAULT 5,
    MODIFY `VoiceExperienceMax` INTEGER NULL DEFAULT 20,
    MODIFY `TextExpEnabled` BOOLEAN NULL DEFAULT true,
    MODIFY `VoiceExpEnabled` BOOLEAN NULL DEFAULT true,
    MODIFY `TextDefaultMessage` MEDIUMTEXT NULL,
    MODIFY `VoiceDefaultMessage` MEDIUMTEXT NULL;
