import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { GuildMember, ModalSubmitInteraction } from 'discord.js';
import { Emojis } from '../../shared/enum/Emojis';
import { resolveKey } from '@sapphire/plugin-i18next';

export class VoiceNameModalHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit
        });
    }

    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== 'vc-name') return this.none();
        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction) {
        const name = interaction.fields.getTextInputValue('voice-name');
        const member = interaction.guild?.members.cache.get(interaction.user.id);
        await member?.voice.channel?.setName(name).catch(async () => {
            if (interaction.replied) {
                await interaction.editReply({
                    content: (await resolveKey(interaction, 'commands/replies/voice:voice_name_error', { emoji: Emojis.SUCCESS, name: name })),
                });
                return;
            }
            return interaction.reply({
                content: (await resolveKey(interaction, 'commands/replies/voice:voice_name_error', { emoji: Emojis.ERROR })),
            });
        })
        await this.updateName(name, member as GuildMember);
        if (interaction.replied) {
            await interaction.editReply({
                content: (await resolveKey(interaction, 'commands/replies/voice:voice_name_success', { emoji: Emojis.SUCCESS, name: name })),
            });
            return;
        }
        return await interaction.reply({
            content: (await resolveKey(interaction, 'commands/replies/voice:voice_name_success', { emoji: Emojis.SUCCESS, name: name })),
        });
    }

    private async updateName(name: string, member: GuildMember) {
        await this.container.prisma.i_users_temp_voice.upsert({
            where: {
                userId: member.id
            }, update: {
                channelName: name
            }, create: {
                userId: member.id,
                channelName: name
            }
        })
    }
}