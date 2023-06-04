/*
  Warnings:

  - The primary key for the `configtempchannels` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `configtempchannels` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`GuildID`, `TempVoiceCategory`);
