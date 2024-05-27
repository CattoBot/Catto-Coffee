import { Precondition, PreconditionResult } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { ChatInputCommandInteraction, Message } from "discord.js";
import { Emojis } from "../shared/enum/Emojis";

export class PremiumServerPrecondition extends Precondition {
    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        return this.checkPremiumStatus(interaction, interaction.guildId);
    }

    public override async messageRun(message: Message) {
        return this.checkPremiumStatus(message, message.guildId);
    }

    private async checkPremiumStatus(interaction: ChatInputCommandInteraction | Message, guildId: string | null): Promise<PreconditionResult> {
        const premiumServers = await this.getPremiumServers();
        const isPremium = premiumServers.some(server => server.guildId === guildId);

        if (isPremium) {
            return this.ok();
        } else {
            return this.error({ message: await resolveKey(interaction, `preconditions/preconditions:premium_server_only`, { emoji: Emojis.ERROR }) });
        }
    }

    private async getPremiumServers() {
        const servers = await this.container.prisma.premium_servers.findMany({
            select: { guildId: true }
        });

        return servers;
    }
}
