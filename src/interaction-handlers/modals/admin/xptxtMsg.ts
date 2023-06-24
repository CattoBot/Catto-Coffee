import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { Prisma } from "../../../client/PrismaClient";
import config from "../../../config";
import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction } from "discord.js";

export const build = async (interaction: any) => {
  return new Promise(async resolve => {
    const modal = new ModalBuilder()
      .setCustomId("admin:xptxtMsg")
      .setTitle("Mensaje de felicitación para niveles en texto")
    const textInput = new TextInputBuilder()
      .setCustomId("text-message")
      .setLabel("Mensaje de felicitación")
      .setPlaceholder(
        "Mensaje de felicitación, usa {user} para mencionar el usuario."
      )
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(20)
      .setMaxLength(250)
    const text = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);
    modal.addComponents(text);
    await interaction.showModal(modal);
    resolve(true)
  })
}

export class ModalHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.ModalSubmit
    });
  }

  public override parse(interaction: ModalSubmitInteraction) {
    if (interaction.user.bot || !interaction.member || !interaction.guild || interaction.customId !== 'admin:xptxtMsg') return this.none();
    return this.some();
  }

  public async run(interaction: ModalSubmitInteraction) {
    const message = interaction.fields.getTextInputValue("text-message");

    const guildData = await Prisma.guildsData.findUnique({
      where: {
        GuildID: interaction.guildId as string,
      },
    });

    if (guildData) {
      await Prisma.guildsData.update({
        where: {
          GuildID: interaction.guildId as string,
        },
        data: {
          TextDefaultMessage: message,
        },
      });
    } else {
      await Prisma.guildsData.create({
        data: {
          GuildID: interaction.guildId as string,
          TextDefaultMessage: message,
        },
      });
    }

    return interaction.reply({
      content: `Se ha actualizado el mensaje correctamente ${config.emojis.success}`,
    });
  }
}