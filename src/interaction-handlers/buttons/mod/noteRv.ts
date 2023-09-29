import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { Utils } from '../../../util/utils';
import { CattoCoffee } from '../../../App';
import { Database } from '../../../structures/Database';
import { ActionRowBuilder,EmbedBuilder,PermissionFlagsBits,ButtonInteraction,ButtonBuilder,ButtonStyle,GuildMember, User } from "discord.js";
const { Messages } = Utils;

interface optionsObject {
  disabled: boolean | undefined,
  author: string | undefined,
  emoji: string
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
  return new Promise(resolve => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`mod:noteRv_a${options.author}_${data?.join(",")}`)
        .setEmoji(options.emoji)
        .setDisabled(options?.disabled)
        .setStyle(ButtonStyle.Primary)
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
   if (cat == __dirname.split(/\/+/g)[__dirname.split(/\/+/g).length - 1] && id == __filename.split(/\/+/g)[__filename.split(/\/+/g).length - 1].split(/\.+/g)[0]) {
      const restriction: string = interaction.customId.split(/:+/g)[1].split(/_+/g)[1];
      let permited: boolean = restriction.startsWith("a")
      if (!permited && restriction.startsWith("u")) {
        permited = (interaction.user.id == restriction.slice(1, restriction.length))
      }
      if (permited) {
        return this.some();
      } else {
        let embed = new EmbedBuilder()
          .setDescription(Messages.InteractionOwner.Button)
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

    const note = await Database.userNotes.findUnique({
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

    const note_perpetrator = await CattoCoffee.users.fetch(note.Perpetrator) as User;
    const note_user = await CattoCoffee.users.fetch(note.UserID) as User;

    var permited = !isNaN(parseInt(note.ReadRoleID || ".")) || note_perpetrator.id == miembro.id || miembro.roles.cache.has(`${note.ReadRoleID}`) || miembro.permissions.has(PermissionFlagsBits.ManageGuild)

    if (permited) {

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${note_perpetrator.username}${note_perpetrator.discriminator && parseInt(note_perpetrator.discriminator) != 0 ? `#${note_perpetrator.discriminator}` : ""}`,
          iconURL: note_perpetrator.avatarURL() || "https://archive.org/download/discordprofilepictures/discordgrey.png"
        })
        .setFooter({ text: `Nota #${noteId} ${isNaN(parseInt(note.ReadRoleID || ".")) ? "" : `${permited ? "🔓" : "🔒"}`}` })
        .setTimestamp(parseInt(note.Unix))
        .setColor("#2b2d31");

      const urls = note.AttachmentURL?.split(/;+/g)

      if (urls) {
        if (urls[0].endsWith(".png") || urls[0].endsWith(".jpg") || urls[0].endsWith(".jpeg") || urls[0].endsWith(".gif")) {
          embed.setImage(urls[0])
        }
        embed.setDescription(
          `
        **Miembro:** ${note_user.username}${note_user.discriminator && parseInt(note_user.discriminator) != 0 ? `#${note_user.discriminator} (${note.UserID})` : ""}
        ${isNaN(parseInt(note.ReadRoleID || ".")) ? `` : `**Restricciones:** <@&${note.ReadRoleID}>\n`}**Nota:** ${note.Note.replace(/%39%+/g, "'").substring(0, 1800)}\n\nLink de descarga: [${urls[0].split(/\/+/g)[urls[0].split(/\/+/g).length - 1]}](${urls[0]})
        `
        )
      } else {
        embed.setDescription(
          `
        **Miembro:** ${note_user.username}${note_user.discriminator && parseInt(note_user.discriminator) != 0 ? `#${note_user.discriminator} (${note.UserID})` : ""}
        ${isNaN(parseInt(note.ReadRoleID || ".")) ? `` : `**Restricciones:** <@&${note.ReadRoleID}>\n`}**Nota:** ${note.Note.replace(/%39%+/g, "'").substring(0, 1800)}
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
      if (urls && urls.length > 1) {
        await attachments.build(boton2, { disabled: true, author: interaction.user.id, emoji: "⬅️" }, [`${noteId}`, "0", "-1"])
        await attachments.build(boton2, { disabled: false, author: interaction.user.id, emoji: "📁" }, [`${noteId}`, "-1", "0"])
        await attachments.build(boton2, { disabled: false, author: interaction.user.id, emoji: "➡️" }, [`${noteId}`, "0", "1"])
        await interaction.reply({ embeds: [embed], components: [boton2, boton], ephemeral: true })
      } else {
        await interaction.reply({ embeds: [embed], components: [boton], ephemeral: true })
      }
    } else {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Esta nota no es visible para ti")
            .setColor("#ed4245")
        ], ephemeral: true
      })
    }
  }
}