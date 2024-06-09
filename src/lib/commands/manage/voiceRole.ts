import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { MessageComponentInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export class VoiceRoleCommands {
    public static async add(interaction: Subcommand.ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role', true);
        const level = interaction.options.getInteger('level', true);
        if (!role) {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:invalid_role'), ephemeral: true });
        }

        const existingRole = await container.prisma.experience_role_rewards.findFirst({
            where: {
                guildId: interaction.guild!.id,
                roleId: role.id,
                roleType: 'voice'
            }
        });

        if (existingRole?.level === level) {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:voice_role_exists', { level: level, emoji: Emojis.ERROR }), ephemeral: true });
        }

        if (existingRole) {
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
            );

            await interaction.reply({
                content: `${Emojis.WARN} This role is already assigned to level \`${existingRole.level}\`. Click **confirm** to update it to \`${level}\` or **cancel** to abort.`,
                components: [row],
                ephemeral: true
            });

            const filter = (i: MessageComponentInteraction) => {
                return i.user.id === interaction.user.id && (i.customId === 'confirm' || i.customId === 'cancel');
            };

            const collector = interaction.channel?.createMessageComponentCollector({
                filter,
                time: 15000,
                max: 1
            });

            collector?.on('collect', async (i: MessageComponentInteraction) => {
                if (i.customId === 'confirm') {
                    await container.prisma.experience_role_rewards.update({
                        where: {
                            guildId_roleId_roleType: {
                                guildId: interaction.guild!.id,
                                roleId: role.id,
                                roleType: 'voice'
                            }
                        },
                        data: {
                            level: level
                        }
                    });
                    await i.update({
                        content: `Successfully updated the level of ${role} to ${level} ${Emojis.SUCCESS}`,
                        components: []
                    });
                } else {
                    await i.update({
                        content: `Operation canceled ${Emojis.ERROR}`,
                        components: []
                    });
                }
            });

            collector?.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({
                        content: 'No response received, operation canceled.',
                        components: []
                    });
                }
            });
        } else {
            await container.prisma.experience_role_rewards.create({
                data: {
                    guildId: interaction.guild!.id,
                    roleId: role.id,
                    roleType: 'voice',
                    level: level
                }
            });

            return await interaction.reply({
                content: await resolveKey(interaction, 'commands/replies/admin:voice_role_add', { role: role, emoji: Emojis.SUCCESS }),
                ephemeral: true
            });
        }
        return;
    }

    public static async remove(interaction: Subcommand.ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role', true);
        if (!role) {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:invalid_role'), ephemeral: true });
        }

        const existingRole = await container.prisma.experience_role_rewards.findFirst({
            where: {
                guildId: interaction.guild!.id,
                roleId: role.id,
                roleType: 'voice'
            }
        });

        if (!existingRole) {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:voice_role_not_exists'), ephemeral: true });
        }

        await container.prisma.experience_role_rewards.delete({
            where: {
                guildId_roleId_roleType: {
                    guildId: interaction.guild!.id,
                    roleId: role.id,
                    roleType: 'voice'
                }
            }
        });

        await container.redis.del(`voiceExperienceRoles:${interaction.guild!.id}`);
        return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/admin:voice_role_remove', { role: role, emoji: Emojis.SUCCESS }) });
    }
}
