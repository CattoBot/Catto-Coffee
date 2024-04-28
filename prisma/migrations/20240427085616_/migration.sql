/*
  Warnings:

  - You are about to drop the column `iv` on the `Webhooks` table. All the data in the column will be lost.
  - Added the required column `url` to the `Webhooks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Webhooks` DROP COLUMN `iv`,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;
