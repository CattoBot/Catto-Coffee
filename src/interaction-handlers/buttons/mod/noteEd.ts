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
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
  return new Promise(resolve => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`mod:noteEd_a${options.author}_${data?.join(",")}`)
        .setEmoji(`✏️`)
        .setDisabled(options?.disabled)
        .setStyle(ButtonStyle.Success)
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

    const guildId = interaction.guild?.id
    const miembro = interaction.member as GuildMember;

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

    var permited = note_perpetrator.id == miembro.id || miembro.permissions.has(PermissionFlagsBits.ManageRoles)

    if (permited) {
      const modal = await import('../../modals/mod/noteEdit');
      modal.build(interaction, { textValue: note.Note, noteID: noteId })
    } else {
      return await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("No puedes editar esta nota")
            .setColor("#ed4245")
        ]
      })
    }
  }
}