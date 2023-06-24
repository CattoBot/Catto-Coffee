import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import config from "../../../config"
import Client from "../../..";
import { Prisma } from "../../../client/PrismaClient";
import {
  ActionRowBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  User
} from "discord.js";

interface optionsObject {
  disabled: boolean | undefined,
  author: string | undefined,
  emoji: string
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
  return new Promise(resolve => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`mod:noteAt_u${options.author}_${data?.join(",")}`)
        .setEmoji(options.emoji)
        .setDisabled(options?.disabled)
        .setStyle(ButtonStyle.Secondary)
    );
    resolve(true)
  })
};

export class ButtonHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button
    });
  }

  public override async parse(interaction: ButtonInteraction) {
    const cat: string = interaction.customId.split(/:+/g)[0];
    const id: string = interaction.customId.split(/:+/g)[1].split(/_+/g)[0];
    if (cat == __dirname.split(/\\+/g)[__dirname.split(/\\+/g).length - 1] && `${id}.js` == __filename.split(/\\+/g)[__filename.split(/\\+/g).length - 1]) {
      const restriction: string = interaction.customId.split(/:+/g)[1].split(/_+/g)[1];
      let permited: boolean = restriction.startsWith("a")
      if (!permited && restriction.startsWith("u")) {
        permited = (interaction.user.id == restriction.slice(1, restriction.length))
      }
      if (permited) {
        return this.some();
      } else {
        let embed = new EmbedBuilder()
          .setDescription(config.messages.interactionOwner.button)
          .setColor("#ed4245")
        await interaction.reply({ embeds: [embed] })
        return this.none();
      }
    } else {
      return this.none();
    }
  }

  public async run(interaction: ButtonInteraction) {
    const customIDsplitted = interaction.customId.split(/_+/g);
  const noteId = customIDsplitted[2].split(/,+/g)[0];
  const page = parseInt(customIDsplitted[2].split(/,+/g)[1]) || 0;
  const movement = parseInt(customIDsplitted[2].split(/,+/g)[2]) || 0;

  const new_page = page + movement

  const miembro = interaction.member as GuildMember;
  const guildId = interaction.guild?.id;

  if (!miembro.permissions.has(PermissionFlagsBits.ManageMessages))
    return interaction.update({
      embeds: [
        new EmbedBuilder()
          .setDescription("No tienes permisos para usar esta opción.")
          .setColor("#ed4245"),
      ],
      components: [],
    });

  const note = await Prisma.userNotes.findUnique({
    where: {
      NoteID_GuildID: {
        NoteID: parseInt(noteId),
        GuildID: `${guildId}`
      }
    }
  })

  if (!note || note?.NoteID != parseInt(noteId))
    return await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setDescription("No se encontró la nota")
          .setColor("#ed4245")
      ]
    })

  const note_perpetrator = await Client.users.fetch(note.Perpetrator) as User;
  const note_user = await Client.users.fetch(note.UserID) as User;

  var permited = !isNaN(parseInt(note.ReadRoleID || ".")) || note_perpetrator.id == miembro.id || miembro.roles.cache.has(`${note.ReadRoleID}`) || miembro.permissions.has(PermissionFlagsBits.ManageGuild)

  if (permited) {

    const urls = note.AttachmentURL?.split(/;+/g)

    if (page < 0) {

      var embeds: EmbedBuilder[] = []

      urls?.forEach((url) => {
        let embed = new EmbedBuilder()
          .setColor("#2b2d31")
          .setTitle(`${url.split(/\/+/g)[url.split(/\/+/g).length - 1]}`)

        if (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".gif")) {
          embed.setImage(url)
        }
        embed.setDescription(`Link de descarga: [${url.split(/\/+/g)[url.split(/\/+/g).length - 1]}](${url})`)
        embeds.push(embed)
      })

      await interaction.reply({
        embeds: embeds,
        ephemeral: true
      })

    } else {

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${note_perpetrator.username}${note_perpetrator.discriminator && parseInt(note_perpetrator.discriminator) != 0 ? `#${note_perpetrator.discriminator}` : ""}`,
          iconURL: note_perpetrator.avatarURL() || "https://archive.org/download/discordprofilepictures/discordgrey.png"
        })
        .setColor("#2b2d31")
        .setFooter({ text: `Nota #${noteId} ${isNaN(parseInt(note.ReadRoleID || ".")) ? "" : `${permited ? "🔓" : "🔒"}`}` })
        .setTimestamp(parseInt(note.Unix))

      if (urls) {
        if (urls[new_page].endsWith(".png") || urls[new_page].endsWith(".jpg") || urls[new_page].endsWith(".jpeg") || urls[new_page].endsWith(".gif")) {
          embed.setImage(urls[new_page])
        }
        embed.setDescription(
          `
          **Miembro:** ${note_user.username}${note_user.discriminator && parseInt(note_user.discriminator) != 0 ? `#${note_user.discriminator} (${note.UserID})` : ""}
          ${isNaN(parseInt(note.ReadRoleID || ".")) ? "" : `**Restricciones:** <@&${note.ReadRoleID}>\n`}**Nota:** ${note.Note.replace(/%39%+/g, "'").substring(0, 1800)}
          
          Link de descarga: [${urls[new_page].split(/\/+/g)[urls[new_page].split(/\/+/g).length - 1]}](${urls[new_page]})
          `
        )
      }

      const boton = new ActionRowBuilder<ButtonBuilder>
      const boton2 = new ActionRowBuilder<ButtonBuilder>
      const reveal = await import('./noteRv');
      const edit = await import('./noteEd');
      const remove = await import('./noteRmQ');
      const attachments = await import('./noteAt');

      await edit.build(boton, { disabled: false, author: interaction.user.id }, [`${note.NoteID}`])
      await reveal.build(boton, { disabled: true, author: interaction.user.id, emoji: "🔒" }, [`${note.NoteID}`])
      await remove.build(boton, { disabled: false, author: interaction.user.id }, [`${note.NoteID}`])
      await attachments.build(boton2, { disabled: (new_page == 0), author: interaction.user.id, emoji: "⬅️" }, [`${noteId}`, `${new_page}`, "-1"])
      await attachments.build(boton2, { disabled: false, author: interaction.user.id, emoji: "📁" }, [`${noteId}`, "-1", "0"])
      await attachments.build(boton2, { disabled: ((new_page + 1) == urls?.length), author: interaction.user.id, emoji: "➡️" }, [`${noteId}`, `${new_page}`, "1"])

      await interaction.update({ embeds: [embed], components: [boton2, boton] })

    }

  } else {

    return await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setDescription("Esta nota no es visible para ti")
          .setColor("#ed4245")
      ]
    })

  }
  }
}