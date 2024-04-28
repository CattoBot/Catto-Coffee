import { Guild, GuildChannel, InteractionResponse, PermissionFlagsBits } from "discord.js";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { Prisma, PrismaCoreModule } from "@lib/database/prisma";

export class VoiceSetupCommand {
    private static prisma: PrismaCoreModule = Prisma; Prisma;

    public static async run(guild: Guild, interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const category = await VoiceSetupCommand.createCategory(guild)
        const channel = await VoiceSetupCommand.createVoiceChannel(guild, category?.id);
        await VoiceSetupCommand.createDatabaseEntry(guild, channel, category);
        return interaction.reply(await resolveKey(interaction, 'commands/replies/voice:voice_setup_success', { emoji: Emojis.SUCCESS }))
    }

    private static async createCategory(guild: Guild): Promise<GuildChannel> {
        try {
            return await guild?.channels.create({
                name: 'Crea tu canal',
                type: 4,
            });
        } catch (error) {
            console.error(error);
        }

    }

    private static async createVoiceChannel(guild: Guild, categoryId: string): Promise<GuildChannel> {
        try {
            return await guild?.channels.create({
                name: '🔉・Únete para Crear',
                parent: categoryId,
                type: 2,
                permissionOverwrites: [{
                    id: guild.roles.everyone.id,
                    allow: PermissionFlagsBits.Connect,
                }],
            });
        } catch (error) {
            console.error(error);
        }

    }

    private static async createDatabaseEntry(guild: Guild, channel: GuildChannel, category: GuildChannel): Promise<void> {
        try {
            await this.prisma.iVoices.create({
                data: {
                    channelId: channel.id,
                    guildId: guild.id,
                    categoryId: category.id
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    private static async retrieveSetupDataFromDatabase() {
        // TODO: Database settings retrieval
    }
}