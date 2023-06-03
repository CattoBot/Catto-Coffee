import {
  InteractionHandler,
  InteractionHandlerTypes,
  PieceContext,
} from "@sapphire/framework";
import type { ModalSubmitInteraction } from "discord.js";
import { Prisma } from "../../../prisma/PrismaClient";
import config from "../../config";

export class VoiceMessageModal extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
    });
  }

  public override parse(interaction: ModalSubmitInteraction) {
    if (interaction.customId !== "vc-message") return this.none();

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
