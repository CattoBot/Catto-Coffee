import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { ChatInputCommand } from "@sapphire/framework";
import { EncryptionService } from "@utils/encrypt";
import { InteractionResponse, TextChannel } from "discord.js";

export class WebhookLogsCommand {
    private static prisma: PrismaCoreModule
    private static encryptionService: EncryptionService = new EncryptionService();

    constructor() {
        WebhookLogsCommand.prisma = Prisma;
    }
    public static async run(interaction: ChatInputCommand.Interaction): Promise<void> {
        await interaction.deferReply();
        const channel = interaction.options.getChannel('channel') as TextChannel;

        try {

            const name = 'Catto Coffee';
            const avatar = 'https://cdn.discordapp.com/avatars/1000184915591168080/5f9381a2da87453f74d7b1d6e463fd76.png?size=2048';
            const webhook = await channel.createWebhook({
                name: name,
                avatar: avatar
            });

            await this.saveWebhookToDatabase(interaction.guildId, channel.id, webhook.id, webhook.token);

            await interaction.followUp({ content: `Webhook set up successfully. Webhook URL is confidential and not displayed.`, ephemeral: true });
        } catch (error) {
            console.error('Failed to create or fetch webhook:', error);
            await interaction.followUp({ content: 'Failed to set up the webhook.', ephemeral: true });
        }
    }

    private static async saveWebhookToDatabase(guild_id: string, channel_id: string, id: string, webhookToken: string) {
        const encryptedToken = this.encryptionService.encrypt(webhookToken);
        try {
            await this.prisma.webhooks.create({
                data: {
                    guildId: guild_id,
                    channelId: channel_id,
                    webhookId: id,
                    webhookToken: encryptedToken.content,
                    iv: encryptedToken.iv
                }
            });
        } catch (error) {
            console.error('Failed to save webhook to database:', error);
        }
    }
}