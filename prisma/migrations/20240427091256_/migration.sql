/*
  Warnings:

  - You are about to drop the column `url` on the `Webhooks` table. All the data in the column will be lost.
  - Added the required column `iv` to the `Webhooks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Webhooks` DROP COLUMN `url`,
    ADD COLUMN `iv` VARCHAR(191) NOT NULL;
