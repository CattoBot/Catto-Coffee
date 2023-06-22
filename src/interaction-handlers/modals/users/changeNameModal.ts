import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { ModalSubmitInteraction } from 'discord.js';
import  config  from '../../../config';

export class ModalHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
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
    const message = interaction.fields.getTextInputValue("voice-name");
    const user = interaction.user.id
    const member = interaction.guild?.members.cache.get(user)
    const VoiceChannel = member?.voice.channel

    await VoiceChannel?.setName(message)

    await interaction.reply({
      content: `${config.emojis.success} El nombre del canal de voz ha sido cambiado a \`${message}\``,

    });
  }
}