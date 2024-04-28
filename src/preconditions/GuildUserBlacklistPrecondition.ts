import { Precondition } from "@sapphire/framework";
import { CommandInteraction } from "discord.js";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Redis, RedisCoreModule } from "@lib/database/redis";

export class GuildUserBlacklistPrecondition extends Precondition {
    private prisma: PrismaCoreModule = Prisma;
    private redis: RedisCoreModule = Redis;

    public async chatInputRun(interaction: CommandInteraction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild?.id;
        if (!guildId) {
            return this.ok();
        }

        const key = `user:guild:blacklist:${userId}:${guildId}`;
        const isBlacklistedInRedis = await this.redis.get(key);
        if (isBlacklistedInRedis) {
            return this.error({
                message: await resolveKey(interaction, 'preconditions/blacklist:user_server', { emoji: Emojis.ERROR }),
            });
        }

        const isBlacklistedInDatabase = await this.prisma.guildBlacklistedUsers.findUnique({
            where: { userId: userId, guildId: guildId }
        });
        if (isBlacklistedInDatabase) {
            await this.redis.set(key, 'true', 'EX', 3600);
            return this.error({
                message: await resolveKey(interaction, 'preconditions/blacklist:user_server', { emoji: Emojis.ERROR }),
            });
        }

        return this.ok();
    }
}
