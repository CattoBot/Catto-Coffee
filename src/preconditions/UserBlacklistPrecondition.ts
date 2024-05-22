import { Precondition } from '@sapphire/framework';
import { CommandInteraction, Message } from 'discord.js';
import { Emojis } from '../shared/enum/Emojis';
import { resolveKey } from '@sapphire/plugin-i18next';

export class UserBlacklistPrecondition extends Precondition {
    public override async chatInputRun(interaction: CommandInteraction) {
        return this.checkBlacklist(interaction.user.id, interaction);
    }

    public override async messageRun(message: Message) {
        return this.checkBlacklist(message.author.id, message);
    }

    private async checkBlacklist(userId: string, context: CommandInteraction | Message) {
        const key = `blacklisted:user:${userId}`;
        const isBlacklistedInRedis = await this.container.redis.get(key);

        if (isBlacklistedInRedis) {
            return this.error({
                message: await resolveKey(context, 'preconditions/blacklist:user', { emoji: Emojis.ERROR })
            });
        }

        const userbl = await this.container.prisma.botBlackListedUsers.findUnique({
            where: { userId: userId }
        });

        if (userbl) {
            await this.container.redis.set(key, 'true', 'EX', 3600);
            return this.error({
                message: await resolveKey(context, 'preconditions/blacklist:user', { emoji: Emojis.ERROR })
            });
        }

        return this.ok();
    }
}
