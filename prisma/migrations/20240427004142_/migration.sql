/*
  Warnings:

  - Added the required column `command_name` to the `RestrictedCommandRoles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RestrictedCommandRoles` ADD COLUMN `command_name` VARCHAR(191) NOT NULL;
