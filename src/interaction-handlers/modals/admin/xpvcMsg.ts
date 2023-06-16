import { InteractionHandler, InteractionHandlerTypes, PieceContext, container } from '@sapphire/framework';
import { Prisma } from "../../../client/PrismaClient";
import Client from "../../..";
import config from "../../../config";
import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  PermissionFlagsBits,
  GuildMember,
  ModalSubmitInteraction,
  User
} from "discord.js";

interface optionsObject {
  textValue: string | undefined,
  noteID: string
}

export const build = async (interaction: any) => {
  return new Promise(async resolve => {
    const modal = new ModalBuilder()
      .setCustomId("admin:xpvcMsg")
      .setTitle("Mensaje de felicitación para niveles en voz")
    const textInput = new TextInputBuilder()
      .setCustomId("voice-message")
      .setLabel("Mensaje de felicitación para niveles en voz")
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
    if (interaction.user.bot || !interaction.member || !interaction.guild) return this.none();
    return this.some();
  }

  public async run(interaction: ModalSubmitInteraction) {
    const message = interaction.fields.getTextInputValue("voice-message");

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
          VoiceDefaultMessage: message,
        },
      });
    } else {
      await Prisma.guildsData.create({
        data: {
          GuildID: interaction.guildId as string,
          VoiceDefaultMessage: message,
        },
      });
    }

    return interaction.reply({
      content: `Se ha actualizado el mensaje correctamente ${config.emojis.success}`,
    });
  }
}