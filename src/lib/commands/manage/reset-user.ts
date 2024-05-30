import { Subcommand } from "@sapphire/plugin-subcommands";
import { CacheType, User } from "discord.js";
import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "../../../shared/enum/Emojis";

export class ResetUserCommand {
    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction<CacheType>) {
        const user = interaction.options.getUser("user", true);
        if (user.bot) {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:bot_experience', { emojis: Emojis.ERROR }), ephemeral: true });
        }

        const module = interaction.options.getString("module", true);

        if (module === "Voice") {
            await this.resetModule(interaction, user, this.getUserVoiceExperience, 'voice');
        } else if (module === "Text") {
            await this.resetModule(interaction, user, this.getUserTextExperience, 'text');
        } else {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:invalid_module', { emoji: Emojis.ERROR }), ephemeral: true });
        }
        return;
    }

    private static async resetModule(
        interaction: Subcommand.ChatInputCommandInteraction<CacheType>,
        user: User,
        getUserExperience: (userId: string, guildId: string) => Promise<any>,
        moduleName: string
    ) {
        const userExperience = await getUserExperience(user.id, interaction.guildId!);
        if (!userExperience) {
            return interaction.reply({ content: `This user doesn't have ${moduleName} experience.`, ephemeral: true });
        }

        await interaction.reply({
            content: await resolveKey(interaction, `commands/replies/admin:confirm_reset_user`, { user: user.displayName, module: moduleName, emoji: Emojis.WARN }),
            ephemeral: false
        });

        const confirm = await interaction.channel?.awaitMessages({
            filter: (msg) => msg.author.id === interaction.user.id,
            max: 1,
            time: 30000,
            errors: ['time']
        }).catch(() => null);

        if (!confirm || !["confirm", "confirmar"].includes(confirm.first()?.content.toLowerCase() || "")) {
            return interaction.followUp({ content: await resolveKey(interaction, `no_time_reset_user`), ephemeral: false });
        }

        await interaction.editReply({
            content: await resolveKey(interaction, `commands/replies/admin:resetting_user_module`, { user: user.displayName, module: moduleName, emoji: Emojis.LOADING })
        });

        if (moduleName === 'voice') {
            await container.prisma.voice_experience.delete({
                where: {
                    guildId_userId: {
                        guildId: interaction.guildId!,
                        userId: user.id
                    }
                }
            });
        } else if (moduleName === 'text') {
            await container.prisma.text_experience.delete({
                where: {
                    guildId_userId: {
                        guildId: interaction.guildId!,
                        userId: user.id
                    }
                }
            });
        }

        await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/admin:reset_user_complete_emoji`, { emoji: Emojis.SUCCESS }) });

        await interaction.followUp({
            content: await resolveKey(interaction, `commands/replies/admin:reset_user_complete`, { user: user.displayName, module: moduleName, emoji: Emojis.SUCCESS })
        });
        return;
    }

    private static async getUserVoiceExperience(userId: string, guildId: string) {
        return await container.prisma.voice_experience.findUnique({
            where: {
                guildId_userId: {
                    guildId: guildId,
                    userId: userId
                }
            }
        });
    }

    private static async getUserTextExperience(userId: string, guildId: string) {
        return await container.prisma.text_experience.findUnique({
            where: {
                guildId_userId: {
                    guildId: guildId,
                    userId: userId
                }
            }
        });
    }
}
