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
        .setCustomId(`mod:noteRmQ_a${options.author}_${data?.join(",")}`)
        .setEmoji(`🗑️`)
        .setDisabled(options?.disabled)
        .setStyle(ButtonStyle.Danger)
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
    if (cat == __dirname.split(/\\+/g)[__dirname.split(/\\+/g).length - 1] && `${id}.ts` == __filename.split(/\\+/g)[__filename.split(/\\+/g).length - 1]) {
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


    const miembro = interaction.member as GuildMember;
    const guildId = interaction.guild?.id

    if (!miembro.permissions.has(PermissionFlagsBits.ManageMessages))
      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("No tienes permisos para usar esta opción.")
            .setColor("#fb6444"),
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
        ],
        components: []
      })

    const note_perpetrator = await Client.users.fetch(note.Perpetrator) as User;
    const note_user = await Client.users.fetch(note.UserID) as User;

    var permited = note_perpetrator.id == miembro.id || miembro.permissions.has(PermissionFlagsBits.ManageGuild)

    if (permited) {
      const botond = new ActionRowBuilder<ButtonBuilder>
      const botone = new ActionRowBuilder<ButtonBuilder>
      const module1 = await import('../general/cancel.ts');
      const module2 = await import('./noteRm.ts');
      await module1.build(botond, { disabled: true, author: interaction.user.id }, [])
      await module2.build(botond, { disabled: true, author: interaction.user.id }, [`${note.NoteID}`])
      await module1.build(botone, { disabled: false, author: interaction.user.id }, [])
      await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${note.NoteID}`])

      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("¡No habrá vuelta atrás!")
            .setDescription(
              `
              ¿Realmente quieres eliminar esta nota?
              ** **
              > **Miembro:** ${note_user.username}${note_user.discriminator && parseInt(note_user.discriminator) != 0 ? `#${note_user.discriminator} (${note.UserID})` : ""}
              > **Autor:** ${note_perpetrator.username}${note_perpetrator.discriminator && parseInt(note_perpetrator.discriminator) != 0 ? `#${note_perpetrator.discriminator}` : ""}
              > **Nota:** ${note.Note.replace(/%39%+/g, "'").replace(/\n+/g, " ").substring(0, 50)}${note.Note.length > 50 ? "..." : ""}
              `
            )
            .setColor("#2b2d31")
        ],
        components: [botond]
      }).then(() => {
        setTimeout(async function () {
          await interaction.editReply({ components: [botone] })
        }, 3000)
      })
    } else {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("¡Hey! Con tus permisos sólo puedes borrar las notas que hayas creado tú.")
            .setColor("#ed4245")
        ], ephemeral: true
      })
    }
  }
}