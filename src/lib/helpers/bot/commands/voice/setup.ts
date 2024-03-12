import { Guild, GuildChannel, InteractionResponse, PermissionFlagsBits } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "@shared/enum/misc/emojis.enum";

export class VoiceSetupCommand {
    private static prisma: PrismaClient = new PrismaClient();

    public static async run(guild: Guild, interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const category = await VoiceSetupCommand.createCategory(guild)
        const channel = await VoiceSetupCommand.createVoiceChannel(guild, category?.id);
        await VoiceSetupCommand.createDatabaseEntry(guild, channel, category);
        return interaction.reply(await resolveKey(interaction, 'commands/replies/voice:voice_setup_success', { emoji: Emojis.SUCCESS }))
    }

    private static async createCategory(guild: Guild): Promise<GuildChannel> {
        return await guild?.channels.create({
            name: 'Crea tu canal',
            type: 4,
        });
    }

    private static async createVoiceChannel(guild: Guild, categoryId: string): Promise<GuildChannel> {
        return await guild?.channels.create({
            name: '🔉・Únete para Crear',
            parent: categoryId,
            type: 2,
            permissionOverwrites: [{
                id: guild.roles.everyone.id,
                allow: PermissionFlagsBits.Connect,
            }],
        });
    }

    private static async createDatabaseEntry(guild: Guild, channel: GuildChannel, category: GuildChannel): Promise<void> {
        try {
            await this.prisma.tempChannelSettings.create({
                data: {
                    id: channel.id,
                    guildId: guild.id,
                    categoryId: category.id,
                }
            })
        } catch (error) {
            console.error(error);
        }
    }
}