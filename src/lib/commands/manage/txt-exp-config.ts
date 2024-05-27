import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { TextChannel } from "discord.js";

export class TextExperienceCommand {
    public static async run(interaction: Subcommand.ChatInputCommandInteraction) {
        const min = interaction.options.getInteger('min');
        const max = interaction.options.getInteger('max');
        const cooldown = interaction.options.getInteger('cooldown');
        const channelNotification = interaction.options.getChannel('channel');
        const messageNotification = interaction.options.getString('message');

        if (min === null && max === null && cooldown === null && channelNotification === null && messageNotification === null) {
            return await interaction.reply({
                content: await resolveKey(interaction, `commands/replies/error:text_no_parameters`, { emoji: Emojis.ERROR }),
                ephemeral: true
            });
        }

        if (min !== null && (min < 1 || min > 1000)) {
            return await interaction.reply({
                content: await resolveKey(interaction, `commands/replies/error:text_min_invalid`, { emoji: Emojis.ERROR }),
                ephemeral: true
            });
        }
        if (max !== null && (max < 1 || max > 1000)) {
            return await interaction.reply({
                content: await resolveKey(interaction, `commands/replies/error:text_max_invalid`, { emoji: Emojis.ERROR }),
                ephemeral: true
            });
        }
        if (min !== null && max !== null && min > max) {
            return await interaction.reply({
                content: await resolveKey(interaction, `commands/replies/error:text_min_greater_than_max`, { emoji: Emojis.ERROR }),
                ephemeral: true
            });
        }

        if (channelNotification !== null && !(channelNotification instanceof TextChannel)) {
            return await interaction.reply({
                content: await resolveKey(interaction, `commands/replies/error:text_channel_invalid`, { emoji: Emojis.ERROR }),
                ephemeral: true
            });
        }

        const updateData: any = {};
        if (min !== null) updateData.min = min;
        if (max !== null) updateData.max = max;
        if (cooldown !== null) updateData.cooldown = cooldown;
        if (channelNotification !== null) updateData.msgChannelId = channelNotification.id;
        if (messageNotification !== null) updateData.lvlUpMsg = messageNotification;

        await container.prisma.i_text_experience.upsert({
            where: {
                guildId: interaction.guild!.id
            },
            create: {
                guildId: interaction.guild!.id,
                min: min ?? 5,
                max: max ?? 20,
                cooldown: cooldown ?? 60,
                msgChannelId: channelNotification?.id ?? '',
                lvlUpMsg: messageNotification ?? ''
            },
            update: updateData
        });
        await container.redis.del(`minMaxExpText:${interaction.guild!.id}`);
        await container.redis.del(`notificationTextChannelID:${interaction.guild!.id}`);
        await container.redis.del(`achievementTextMessage:${interaction.guild!.id}`);

        return await interaction.reply({
            content: await resolveKey(interaction, `commands/replies/admin:text_config_success`, { emoji: Emojis.SUCCESS }),
            ephemeral: false
        });
    }
}
