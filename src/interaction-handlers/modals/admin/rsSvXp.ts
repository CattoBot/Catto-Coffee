import { InteractionHandler, InteractionHandlerTypes, PieceContext, container } from '@sapphire/framework';
import { Database } from '../../../structures/Database';
import { Utils } from '../../../util/utils';
import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, EmbedBuilder } from "discord.js";
const { Emojis } = Utils;
export const build = async (interaction: any, module:string) => {
  return new Promise(async resolve => {
    const chars = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789!?()/#$@=+-._<>%"
    let code:string = ""
    for (let i=0;i<6;i++) {
      let rand = Math.floor(Math.random()*chars.length)
      code += chars.charAt(rand)
    }
    const modal = new ModalBuilder()
      .setCustomId("admin:rsSvXp_"+module+"_"+code)
      .setTitle("Reinicio de xp en el servidor")
    const textInput1 = new TextInputBuilder()
      .setCustomId("servername")
      .setLabel("Nombre del servidor")
      .setPlaceholder(interaction.guild?.name)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setMinLength(interaction.guild?.name.length)
      .setMaxLength(interaction.guild?.name.length)
    const textInput2 = new TextInputBuilder()
      .setCustomId("code")
      .setLabel(`Escribe \"${code}\"`)
      .setPlaceholder(code)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setMinLength(6)
      .setMaxLength(6)
    const text1 = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput1);
    const text2 = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput2);
    modal.addComponents([text1, text2]);
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
    if (interaction.user.bot || !interaction.member || !interaction.guild || !interaction.customId.startsWith('admin:rsSvXp_') ) return this.none();
    return this.some();
  }

  public async run(interaction: ModalSubmitInteraction) {
    const customIdSplitted:string[] = interaction.customId.split(/_+/g);
    const modulo = customIdSplitted[1]
    const realCode = customIdSplitted[2]
    const servername = interaction.fields.getTextInputValue("servername");
    const code = interaction.fields.getTextInputValue("code");
    if (servername != interaction.guild?.name) return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("El nombre de servidor que has especificado no coincide con el nombre real del servidor")
          .setColor("#ed4245")
      ],
      ephemeral: true
    })
    if (code.toUpperCase() != realCode) return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("El código introducido no es correcto")
          .setColor("#ed4245")
      ],
      ephemeral: true
    })

    switch (modulo) {
      case "text":
        const guildTextExperience =
          await Database.usersTextExperienceData.findMany({
            where: {
              GuildID: interaction.guildId as string,
            },
          });

        if (guildTextExperience.length === 0) {
          return interaction.reply({
            content: `No hay datos de experiencia de texto en este servidor ${Emojis.General.Error})}`,
            ephemeral: true,
          });
        }

        await Database.usersTextExperienceData.deleteMany({
          where: {
            GuildID: interaction.guildId as string,
          },
        });

        return interaction.reply({
          content: `Se han restablecido los datos de experiencia de texto ${Emojis.General.Success}`,
        });

      case "voice":
        const guildVoiceExperience =
          await Database.usersVoiceExperienceData.findMany({
            where: {
              GuildID: interaction.guildId as string,
            },
          });
        if (guildVoiceExperience.length === 0) {
          return interaction.reply({
            content: `No hay datos de experiencia de voz en este servidor ${Emojis.General.Error}`,
            ephemeral: true,
          });
        }

        await Database.usersVoiceExperienceData.deleteMany({
          where: {
            GuildID: interaction.guildId as string,
          },
        });

        return interaction.reply({
          content: `Se han restablecido los datos de experiencia de voz ${Emojis.General.Success}`,
        });

      default:
        break;
    }

  }
}