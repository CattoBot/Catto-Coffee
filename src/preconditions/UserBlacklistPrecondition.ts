import { Precondition } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
import { Emojis } from '@shared/enum/misc/emojis.enum';
import { Prisma, PrismaCoreModule } from '@lib/database/prisma';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Redis, RedisCoreModule } from '@lib/database/redis';

export class UserBlacklistPrecondition extends Precondition {
    private prisma: PrismaCoreModule = Prisma;
    private redis: RedisCoreModule = Redis;

    public async chatInputRun(interaction: CommandInteraction) {
        const key = `blacklisted:user:${interaction.user.id}`;
        const isBlacklistedInRedis = await this.redis.get(key);

        if (isBlacklistedInRedis) {
            return this.error({
                message: await resolveKey(interaction, 'preconditions/blacklist:user', { emoji: Emojis.ERROR })
            });
        }

        const userbl = await this.prisma.botBlackListedUsers.findUnique({
            where: { userId: interaction.user.id }
        });

        if (userbl) {
            await this.redis.set(key, 'true', 'EX', 3600); 
            return this.error({
                message: await resolveKey(interaction, 'preconditions/blacklist:user', { emoji: Emojis.ERROR })
            });
        }

        return this.ok();
    }
}
