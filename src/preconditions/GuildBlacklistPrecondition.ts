import { Precondition, PreconditionResult } from "@sapphire/framework";
import { CommandInteraction, Message } from "discord.js";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "../shared/enum/Emojis";

export class GuildBlacklistPrecondition extends Precondition {
    
    private async checkBlacklist(guildId: string, context: CommandInteraction | Message): Promise<PreconditionResult> {
        const key = `blacklisted:guild:${guildId}`;
        const isBlacklistedInRedis = await this.container.redis.get(key);

        if (isBlacklistedInRedis) {
            return this.error({
                message: await resolveKey(context, 'preconditions/blacklist:server', { emoji: Emojis.ERROR }),
            });
        }

        const guildBlacklist = await this.container.prisma.bot_black_listed_guilds.findUnique({
            where: { guildId }
        });

        if (guildBlacklist) {
            await this.container.redis.set(key, 'true', 'EX', 3600);
            return this.error({
                message: await resolveKey(context, 'preconditions/blacklist:server', { emoji: Emojis.ERROR }),
            });
        }

        return this.ok();
    }

    public override async chatInputRun(interaction: CommandInteraction) {
        if (!interaction.guild) {
            return this.ok();
        }

        return this.checkBlacklist(interaction.guild.id, interaction);
    }

    public override async messageRun(message: Message) {
        if (!message.guild) {
            return this.ok();
        }

        return this.checkBlacklist(message.guild.id, message);
    }
}
