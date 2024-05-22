import { Subcommand } from "@sapphire/plugin-subcommands";
import { CacheType } from "discord.js";
import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "../../../shared/enum/Emojis";

export class ResetServerCommand {
    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction<CacheType>) {
        const module = interaction.options.getString("module", true);

        if (module === "Voice") {
            await this.resetModule(interaction, 'voice');
        } else if (module === "Text") {
            await this.resetModule(interaction, 'text');
        } else {
            return interaction.reply({ content: await resolveKey(interaction, 'commands/replies/error:invalid_module'), ephemeral: true });
        }
        return;
    }

    private static async resetModule(
        interaction: Subcommand.ChatInputCommandInteraction<CacheType>,
        moduleName: string
    ) {
        await interaction.reply({
            content: await resolveKey(interaction, `commands/replies/admin:confirm_reset`, { module: moduleName, emoji: Emojis.WARN }),
            ephemeral: false
        });

        const confirm = await interaction.channel?.awaitMessages({
            filter: (msg) => msg.author.id === interaction.user.id,
            max: 1,
            time: 30000,
            errors: ['time']
        }).catch(() => null);

        if (!confirm || confirm.first()?.content.toLowerCase() !== "confirm") {
            return interaction.followUp({ content: await resolveKey(interaction, `commands/replies/error:no_time_reset_server`, { emoji: Emojis.WARN }), ephemeral: false });
        }

        await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/admin:resetting_module`, { module: moduleName, emoji: Emojis.LOADING }) });

        if (moduleName === 'voice') {
            await container.prisma.voiceExperience.deleteMany({
                where: {
                    guildId: interaction.guildId!
                }
            });
        } else if (moduleName === 'text') {
            await container.prisma.textExperience.deleteMany({
                where: {
                    guildId: interaction.guildId!
                }
            });
        }
        await interaction.editReply({ content: await resolveKey(interaction, `commands/replies/admin:reset_user_complete_emoji`, { emoji: Emojis.SUCCESS }) });
        
        await interaction.followUp({ content: await resolveKey(interaction, `commands/replies/admin:reset_complete`, { module: moduleName, emoji: Emojis.SUCCESS }) });
        return;
    }
}
