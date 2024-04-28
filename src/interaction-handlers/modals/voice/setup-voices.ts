import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ChannelType, PermissionFlagsBits, type Guild, type GuildChannel, type InteractionResponse, type ModalSubmitInteraction } from 'discord.js';
import { Emojis } from '@shared/enum/misc/emojis.enum';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Prisma, PrismaCoreModule } from '@lib/database/prisma';

export class VoicesSetupModalHandler extends InteractionHandler {
    private prisma: PrismaCoreModule = Prisma;
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit
        });
    }

    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== 'vc-setups') return this.none();
        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction): Promise<InteractionResponse> {
        const categoryname = interaction.fields.getTextInputValue('category-name');
        const channelname = interaction.fields.getTextInputValue('channel-name');
        const voiceLimit = interaction.fields.getTextInputValue('max-users');
        const isEditable = interaction.fields.getTextInputValue('should-edit');
        const shouldEnumerate = interaction.fields.getTextInputValue('should-enumerate');


        const limit = parseInt(voiceLimit, 10);

        if (isNaN(limit)) {
            return interaction.reply({
                content: (await resolveKey(interaction, 'commands/replies/voice:voice_setup_error_limit', { emoji: Emojis.ERROR })),
            });
        }

        if (limit < 0 || limit > 99) {
            return interaction.reply({
                content: (await resolveKey(interaction, 'commands/replies/voice:voice_setup_error_limit_range', { emoji: Emojis.ERROR })),
            });
        }

        if (isEditable !== 'yes' && isEditable !== 'no') {
            return interaction.reply({
                content: (await resolveKey(interaction, 'commands/replies/voice:voice_setup_error_editable', { emoji: Emojis.ERROR })),
            });
        }

        if (shouldEnumerate !== 'yes' && shouldEnumerate !== 'no') {
            return interaction.reply({
                content: (await resolveKey(interaction, 'commands/replies/voice:voice_setup_error_enumerate', { emoji: Emojis.ERROR })),
            });
        }

        let editable: boolean;
        if (isEditable == 'yes') {
            editable = true;
        } else if (isEditable == 'no') {
            editable = false;
        }

        let enumerate: boolean;
        if (shouldEnumerate == 'yes') {
            enumerate = true;
        } else if (shouldEnumerate == 'no') {
            enumerate = false;
        }

        const category = await this.createCategory(interaction.guild, categoryname);
        const channel = await this.createVoiceChannel(interaction.guild, category.id);
        await this.createDatabaseEntry(interaction.guild, channel, category, limit, channelname, enumerate, editable);
        return interaction.reply({
            content: (await resolveKey(interaction, 'commands/replies/voice:voice_setup_success', { emoji: Emojis.SUCCESS })),
        })
    }

    private async createDatabaseEntry(
        guild: Guild,
        channel: GuildChannel,
        category: GuildChannel,
        channelLimit: number,
        channelName: string,
        shouldEnumerate: boolean,
        shouldEdit: boolean): Promise<void> {
        try {
            await this.prisma.iVoices.create({
                data: {
                    channelId: channel.id,
                    channelLimit: channelLimit,
                    channelName: channelName,
                    shouldEnumerate: shouldEnumerate,
                    editables: shouldEdit,
                    guildId: guild.id,
                    categoryId: category.id
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    private async createCategory(guild: Guild, name: string): Promise<GuildChannel> {
        try {
            return await guild?.channels.create({
                name: name,
                type: 4,
            });
        } catch (error) {
            console.error(error);
        }

    }

    private async createVoiceChannel(guild: Guild, categoryId: string): Promise<GuildChannel> {
        try {
            return await guild?.channels.create({
                name: "Join to Create",
                parent: categoryId,
                type: ChannelType.GuildVoice,
                userLimit: 99,
                permissionOverwrites: [{
                    id: guild.roles.everyone.id,
                    allow: PermissionFlagsBits.Connect,
                }],
            });
        } catch (error) {
            console.error(error);
        }
    }
}