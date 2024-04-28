/*
  Warnings:

  - A unique constraint covering the columns `[guild_id,channel_id,user_id]` on the table `VoiceUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `VoiceUsers_guild_id_channel_id_user_id_key` ON `VoiceUsers`(`guild_id`, `channel_id`, `user_id`);
