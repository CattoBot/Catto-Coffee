import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { ModalSubmitInteraction } from 'discord.js';
import { Utils } from '../../../util/utils';

export class VoiceNameModal extends InteractionHandler {
    cooldowns: any;
    public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit
        });
        this.cooldowns = new Map();
    }

    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== 'vc-name') return this.none();

        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction) {
        const message = interaction.fields.getTextInputValue('voice-name');
        const user = interaction.user.id;
        const member = interaction.guild?.members.cache.get(user);
        const voiceChannel = member?.voice.channel;
        const cooldownDuration = 5 * 60 * 1000;
        const now = Date.now();
        const cooldownExpiration = this.cooldowns.get(user) || 0;
        if (cooldownExpiration > now) {
            const remainingCooldown = Math.ceil((cooldownExpiration - now) / 1000);
            const minutes = Math.floor(remainingCooldown / 60);
            const seconds = remainingCooldown % 60;
            await interaction.reply({
                content: `${Utils.getEmojis().General.Error} Debes esperar \`${minutes}\` minutos y \`${seconds}\` segundos antes de cambiar el nombre del canal de voz nuevamente.`,
                ephemeral: true,
            });
            return;
        }
        await voiceChannel?.setName(message);
        await interaction.reply({
            content: `${Utils.getEmojis().General.Success} El nombre del canal de voz ha sido cambiado a \`${message}\``,
        });
        const newCooldownExpiration = now + cooldownDuration;
        this.cooldowns.set(user, newCooldownExpiration);
    }
}