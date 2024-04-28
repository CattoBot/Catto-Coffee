-- CreateTable
CREATE TABLE `RestrictedCommandRoles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `command_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RestrictedCommandRoles_guild_id_command_id_key`(`guild_id`, `command_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RestrictedCommandRoles` ADD CONSTRAINT `RestrictedCommandRoles_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guilds`(`guild_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
