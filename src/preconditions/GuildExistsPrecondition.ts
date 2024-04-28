import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { Redis, RedisCoreModule } from "@lib/database/redis";
import { Precondition } from "@sapphire/framework";
import { CommandInteraction } from "discord.js";

export class GuildExistsPrecondition extends Precondition {
    private prisma: PrismaCoreModule = Prisma;
    private redis: RedisCoreModule = Redis;

    public async chatInputRun(interaction: CommandInteraction) {
        const guildId = interaction.guildId;
        const cacheKey = `guild:${guildId}`;
        const cachedData = await this.redis.get(cacheKey);
        let guild: unknown;

        if (cachedData) {
            guild = JSON.parse(cachedData);
        } else {
            guild = await this.prisma.guilds.findUnique({ where: { guildId } });
            if (!guild) {
                guild = await this.prisma.guilds.create({ data: { guildId } });
            }
            await this.redis.set(cacheKey, JSON.stringify(guild), 'EX', 3600);
        }
        return this.ok();
    }
}
