import { Precondition } from "@sapphire/framework";
import { CommandInteraction } from "discord.js";
import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Redis, RedisCoreModule } from "@lib/database/redis";
import { Emojis } from "@shared/enum/misc/emojis.enum";

export class GuildBlacklistPrecondition extends Precondition {
    private prisma: PrismaCoreModule = Prisma;
    private redis: RedisCoreModule = Redis;

    public async chatInputRun(interaction: CommandInteraction) {
        if (!interaction.guild) {
            return this.ok();
        }

        const key = `blacklisted:guild:${interaction.guild.id}`;
        const isBlacklistedInRedis = await this.redis.get(key);

        if (isBlacklistedInRedis) {
            return this.error({
                message: await resolveKey(interaction, 'preconditions/blacklist:server', { emoji: Emojis.ERROR }),
            });
        }

        const guildBlacklist = await this.prisma.botBlackListedGuilds.findUnique({
            where: { guildId: interaction.guild.id }
        });

        if (guildBlacklist) {
            await this.redis.set(key, 'true', 'EX', 3600);
            return this.error({
                message: await resolveKey(interaction, 'preconditions/blacklist:server', { emoji: Emojis.ERROR }),
            });
        }
        return this.ok();
    }
}
