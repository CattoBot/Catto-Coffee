import { Subcommand } from '@sapphire/plugin-subcommands';
import { container } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Emojis } from '../../../shared/enum/Emojis';

export class GuildBadgesCommand {
    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.deferReply();
        const guild = await this.find(interaction.guildId!);
        if (guild && guild.length > 0) {
            return interaction.editReply({ content: await resolveKey(interaction, `commands/replies/error:already_badges`, { emoji: Emojis.ERROR }) });
        }
        const badge = interaction.options.getAttachment("badge", true);
        if (badge.height! > 512 || badge.width! > 512) {
            return interaction.editReply({ content: await resolveKey(interaction, `commands/replies/error:badge_size`, { emoji: Emojis.ERROR }) });
        }

        const url = await container.cloudinary.uploadImage(badge.url, interaction.guildId!);

        try {
            await container.prisma.$transaction(async (prisma) => {
                const createdBadge = await prisma.badges.create({
                    data: {
                        badgeUrl: url,
                        name: interaction.guild?.name || 'Unknown Guild',
                    }
                });
                await prisma.guild_badges.create({
                    data: {
                        guildId: interaction.guildId!,
                        badgeId: createdBadge.id
                    }
                });
            });

            return interaction.editReply({ content: await resolveKey(interaction, `commands/replies/admin:badge_success`, { emoji: Emojis.SUCCESS }) });
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: await resolveKey(interaction, `commands/replies/error:error`, { emoji: Emojis.ERROR }) });
        }
    }

    public static async chatInputRemove(interaction: Subcommand.ChatInputCommandInteraction) {
        const guild = await this.find(interaction.guildId!);
        if (!guild || guild.length === 0) {
            return interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:no_badges`, { emoji: Emojis.ERROR }), ephemeral: true });
        }
        try {
            await container.cloudinary.deleteImage(interaction.guildId!);

            await container.prisma.$transaction(async (prisma) => {
                await prisma.guild_badges.deleteMany({
                    where: {
                        guildId: interaction.guildId!
                    }
                });
                await prisma.badges.deleteMany({
                    where: {
                        id: guild[0].badgeId
                    }
                });
            });

            return interaction.reply({ content: await resolveKey(interaction, `commands/replies/admin:badge_remove`, { emoji: Emojis.SUCCESS }), ephemeral: false });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: await resolveKey(interaction, `commands/replies/error:error`, { emoji: Emojis.ERROR }), ephemeral: true });
        }
    }

    private static async find(guildId: string) {
        const guild = await container.prisma.guild_badges.findMany({
            where: {
                guildId
            },
            include: {
                badges: true
            }
        });
        return guild;
    }
}
