import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, ButtonInteraction, ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";
import { Database } from '../../../structures/Database';
import { Catto_Coffee } from '../../../App';
import { Utils } from '../../../util/utils';
const { Messages, Emojis } = Utils;
interface optionsObject {
  disabled: boolean | undefined,
  author: string | undefined,
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
  return new Promise(resolve => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`admin:rsUrXp_a${options.author}_${data?.join(",")}`)
        .setLabel(`REINICIAR`)
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
    const userId = customIDsplitted[2].split(/,+/g)[0];
    const modulo = customIDsplitted[2].split(/,+/g)[1];

    const miembro = interaction.member as GuildMember;
    const guildId = interaction.guild?.id

    let user = Catto_Coffee.users.cache.get(userId);

    if (!miembro.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setDescription("No tienes permisos para usar esta opción.")
            .setColor("#fb6444"),
        ],
        components: [],
      });
    
    try {
      switch (modulo) {
        case "text":
          const textUser = await Database.usersTextExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                UserID: userId as string,
                GuildID: interaction.guildId as string,
              },
            },
          });

          if (!textUser) {
            await interaction.update({
              content: `El usuario \`${user?.username}\` no tiene datos de experiencia en el modulo de texto.`,
              embeds: [],
              components: []
            });
            return;
          } else {
            await Database.usersTextExperienceData.delete({
              where: {
                UserID_GuildID: {
                  UserID: userId as string,
                  GuildID: interaction.guildId as string,
                },
              },
            });
            await interaction.update({
              content: `Se ha restablecido el nivel del usuario \`${user?.username}\` en el modulo de texto. ${Emojis.General.Success}`,
              embeds: [],
              components: []
            });
          }

        case "voice":
          const voiceUser = await Database.usersVoiceExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                UserID: userId as string,
                GuildID: interaction.guildId as string,
              },
            },
          });

          if (!voiceUser) {
            await interaction.update({
              content: `El usuario \`${user?.username}\` no tiene datos de experiencia en el modulo de voz.`,
              embeds: [],
              components: []
            });
            return;
          } else {
            await Database.usersVoiceExperienceData.delete({
              where: {
                UserID_GuildID: {
                  UserID: userId as string,
                  GuildID: interaction.guildId as string,
                },
              },
            });
            await interaction.update({
              content: `Se ha restablecido el nivel del usuario \`${user?.username}\` en el modulo de voz. ${Emojis.General.Success}`,
              embeds: [],
              components: []
            });
          }
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }

  }
}