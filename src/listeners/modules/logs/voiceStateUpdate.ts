import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { VoiceState, WebhookClient } from "discord.js";
import { EmbedBuilder } from "discord.js";
import {
    Redis, RedisCoreModule

} from "@lib/database/redis";
import { EncryptionService } from "@utils/encrypt";

@ApplyOptions<Listener.Options>({ event: Events.VoiceStateUpdate, once: false })
export class VoiceStateUpdateLogs extends Listener {
    private prisma: PrismaCoreModule
    private redis: RedisCoreModule
    private encrypt: EncryptionService
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
        this.prisma = Prisma;
        this.redis = Redis;
        this.encrypt = new EncryptionService();
    }

    public async run(oldState: VoiceState, newState: VoiceState) {
        if (!newState.guild) return;

        const webhookData = await this.getCachedWebhookData(newState.guild.id);
        if (!webhookData) {
            this.container.logger.warn('No webhook data found for this guild.');
            return;
        }

        const decryptedToken = this.encrypt.decrypt({ iv: webhookData.iv, content: webhookData.webhookToken });
        const webhookClient = new WebhookClient({ id: webhookData.webhookId, token: decryptedToken });

        const descriptionEmbed = this.generateDescription(oldState, newState);
        if (!descriptionEmbed) {
            this.container.logger.warn('No significant voice state change to report.');
            return; // Prevent sending an empty message or invalid embed
        }

        try {
            await webhookClient.send({
                embeds: [descriptionEmbed],
                username: 'Catto Coffee',
                avatarURL: 'https://cdn.discordapp.com/avatars/1000184915591168080/5f9381a2da87453f74d7b1d6e463fd76.png?size=2048'
            });
        } catch (error) {
            this.container.logger.error('Failed to send webhook message:', error);
        }
    }

    private async getCachedWebhookData(guildId: string) {
        const cacheKey = `webhook:${guildId}`;
        let data = await this.redis.get(cacheKey);
        if (data) return JSON.parse(data);
        try {
            const webhookData = await this.prisma.webhooks.findUnique({
                where: { guildId }
            });
            if (webhookData) {
                await this.redis.set(cacheKey, JSON.stringify(webhookData), 'EX', 86400);
                return webhookData;
            }
        } catch (error) {
            this.container.logger.error('Failed to retrieve webhook from database:', error);
        }
        return null;
    }

    private generateDescription(oldState: VoiceState, newState: VoiceState): EmbedBuilder | null {
        const user = newState.member?.user.tag;
        const embed = new EmbedBuilder().setColor('#FFFFFF');

        if (!oldState.channel && newState.channel) {
            embed.setDescription(`${user} joined ${newState.channel.name}.`);
            return embed;
        } else if (oldState.channel && !newState.channel) {
            embed.setDescription(`${user} left ${oldState.channel.name}.`);
            return embed;
        } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            embed.setDescription(`${user} switched from ${oldState.channel.name} to ${newState.channel.name}.`);
            return embed;
        }
        return null; 
    }
}