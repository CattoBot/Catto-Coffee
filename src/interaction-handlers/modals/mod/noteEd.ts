import { InteractionHandler, InteractionHandlerTypes, PieceContext, container } from '@sapphire/framework';
import { Prisma } from "../../../client/PrismaClient";
import Client from "../../..";
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

export const build = async (interaction: any, options: optionsObject) => {
  return new Promise(async resolve => {
    const modal = new ModalBuilder()
      .setCustomId(`mod:noteEd_${options.noteID}`)
      .setTitle("Edita una nota");
    const textInput = new TextInputBuilder()
      .setCustomId("text")
      .setLabel("Nuevo texto")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMinLength(1)
      .setValue(`${options.textValue}`)
      .setMaxLength(1800);
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
    const customIDsplitted = interaction.customId.split(/_+/g);
    const miembro = interaction.member as GuildMember;
    const noteId = customIDsplitted[1];
    const guildId = interaction.guild?.id;
    const text = interaction.fields.getTextInputValue("text");

    const note = await Prisma.userNotes.findUnique({
      where: {
        NoteID_GuildID: {
          NoteID: parseInt(noteId),
          GuildID: `${guildId}`
        }
      }
    })

    if (!note || note?.NoteID != parseInt(noteId))
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("No se encontró la nota")
            .setColor("#ed4245")
        ], ephemeral: true
      })

    const note_perpetrator = await Client.users.fetch(note.Perpetrator) as User;

    var permited = note_perpetrator.id == miembro.id || miembro.permissions.has(PermissionFlagsBits.ManageRoles)

    if (permited) {

      await Prisma.userNotes.update({
        where: {
          NoteID_GuildID: {
            NoteID: parseInt(noteId),
            GuildID: `${guildId}`
          }
        },
        data: {
          Note: text.replace(/'+/g, "%39%").replace(/\\+/g, "\\\\")
        }
      })

      const this_guild_config_channels = await Prisma.configChannels.findUnique({
        where: {
          GuildID: guildId
        }
      })

      if (
        this_guild_config_channels &&
        this_guild_config_channels.NotesLogs &&
        !isNaN(parseInt(this_guild_config_channels.NotesLogs))
      ) {

        let oldTextArray = note.Note.replace(/%39%+/g, "'").substring(0, 1018).split(/ +/g)
        oldTextArray.pop()
        let newTextArray = text.replace(/%39%+/g, "'").substring(0, 1018).split(/ +/g)
        newTextArray.pop()

        const new_note_log = new EmbedBuilder()
          .setTimestamp()
          .setColor("#fee528")
          .setAuthor({
            name: `${miembro.user.username}${miembro.user.discriminator && parseInt(miembro.user.discriminator) != 0 ? `#${miembro.user.discriminator}` : ""}`,
            iconURL: miembro.user.avatarURL() || "https://archive.org/download/discordprofilepictures/discordgrey.png"
          })
          .setDescription(
            `
            **Acción:** Editar nota
            `
          )
          .setFields(
            {
              name: "Antes:",
              value: note.Note.length > 1024 ? `${oldTextArray.join(" ")} [...]` : `${note.Note.replace(/%39%+/g, "'")}`,
            },
            {
              name: "Ahora:",
              value: text.replace(/%39%+/g, "'").length > 1024 ? `${newTextArray.join(" ")} [...]` : `${text.replace(/%39%+/g, "'")}`
            }
          )
          .setFooter({ text: `Nota #${noteId}` })

        const notes_logs_channel: any = Client.channels.resolve(this_guild_config_channels.NotesLogs)
        notes_logs_channel
          .send({ embeds: [new_note_log] })
      }

      container.logger.info(`\x1b[32m${miembro.id}\x1b[0m ha modificado la \x1b[33mNOTA#${noteId}\x1b[0m en \x1b[36m${interaction.guild?.name} (${guildId})\x1b[0m`)

      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("La nota ha sido modificada exitosamente")
            .setColor("#2b2d31")
        ], ephemeral: true
      })

    } else {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("No puedes editar esta nota")
            .setColor("#ed4245")
        ], ephemeral: true
      })
    }
  }
}