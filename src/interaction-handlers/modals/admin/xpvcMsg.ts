import { InteractionHandler, InteractionHandlerTypes, PieceContext, container } from '@sapphire/framework';
import { ModalSubmitInteraction } from "discord.js";
import { Database } from '../../../structures/Database';
import { Utils } from '../../../util/utils';
const { Emojis } = Utils;
export class ModalHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.ModalSubmit
    });
  }

  public override parse(interaction: ModalSubmitInteraction) {
    if (interaction.user.bot || !interaction.member || !interaction.guild || interaction.customId !== 'admin:xpvoicemsg') return this.none();
    return this.some();
  }

  public async run(interaction: ModalSubmitInteraction) {
    const message = interaction.fields.getTextInputValue("voice-message");

     await Database.guildsData.upsert({
      where: {
        GuildID: interaction.guildId as string,
      },
      create: {
        GuildID: interaction.guildId as string,
        VoiceDefaultMessage: message,
      },
      update: {
        VoiceDefaultMessage: message,
      },
    });

    return interaction.reply({
      content: `Se ha actualizado el mensaje correctamente ${Emojis.General.Success}`,
    });
  }
}