import { Subcommand } from "@sapphire/plugin-subcommands";
import { ChatInputCommand } from "@sapphire/framework";
import { Prisma } from "../../../prisma/PrismaClient";
import config from "../../config";
import Client from "../..";
import {
  ChannelType,
  TextChannel,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export class AdminSubCommands extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: "admin",
      fullCategory: ["Admin"],
      description: "Comandos de administración",
      preconditions: ["AdminOnly"],
      subcommands: [
        {
          name: "disable",
          chatInputRun: "chatInputDisable",
        },
        {
          name: "enable",
          chatInputRun: "chatInputEnable",
        },
        {
          name: "config",
          type: "group",
          entries: [
            { name: "xp", chatInputRun: "chatInputExp" },
            { name: "xp-channel", chatInputRun: "chatInputVoiceExpChannel" },
            {
              name: "notification",
              chatInputRun: "chatInputVoiceExpNotification",
            },
            {
              name: "rol",
              chatInputRun: "chatInputExpRol",
            },
          ],
        },
        {
          name: "reset",
          type: "group",
          entries: [
            { 
              name: "server", 
              chatInputRun: "chatInputResetExp" 
            },
            {
              name: "user",
              chatInputRun: "chatInputResetExpUser"
            }
          
          ],
        },
      ],
    });
  }

  registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("admin")
        .setDescription("Comandos de administración")
        .addSubcommand((command) =>
          command
            .setName("disable")
            .setDescription("Desactiva un modulo del bot")
            .addStringOption((option) =>
              option
                .setName("modulo")
                .setDescription("Que modulo quieres desactivar")
                .setRequired(true)
                .addChoices(
                  {
                    name: "Text Experience",
                    value: "text",
                  },
                  {
                    name: "Voice Experience",
                    value: "voice",
                  }
                )
            )
        )

        .addSubcommand((command) =>
          command
            .setName("enable")
            .setDescription("Activa un modulo del bot")
            .addStringOption((option) =>
              option
                .setName("modulo")
                .setDescription("Que modulo quieres activar")
                .setRequired(true)
                .addChoices(
                  {
                    name: "Text Experience",
                    value: "text",
                  },
                  {
                    name: "Voice Experience",
                    value: "voice",
                  }
                )
            )
        )

        .addSubcommandGroup((group) =>
          group
            .setName("config")
            .setDescription("Configuración del sistema de experiencia")
            .addSubcommand((command) =>
              command
                .setName("xp")
                .setDescription(
                  "Configura la cantidad de experiencia que se obtiene"
                )
                .addStringOption((option) =>
                  option
                    .setName("modulo")
                    .setDescription(
                      "Que modulo de experiencia quieres configurar"
                    )
                    .setRequired(true)
                    .addChoices(
                      {
                        name: "Texto",
                        value: "text",
                      },
                      {
                        name: "Voz",
                        value: "voice",
                      }
                    )
                )
                .addIntegerOption((option) =>
                  option
                    .setName("min")
                    .setDescription(
                      "La cantidad de experiencia minima que quieres que se de."
                    )
                    .setRequired(true)
                )
                .addIntegerOption((option) =>
                  option
                    .setName("max")
                    .setDescription(
                      `La cantidad de experiencia maxima que quieres que se de.`
                    )
                    .setRequired(true)
                )
            )
            .addSubcommand((command) =>
              command
                .setName("rol")
                .setDescription(
                  `Rol que se le dara al usuario al subir de nivel.`
                )
                .addStringOption((option) =>
                  option
                    .setName("modulo")
                    .setDescription(
                      `A que modulo de experiencia quieres configurar el rol`
                    )
                    .setRequired(true)
                    .addChoices(
                      {
                        name: "Texto",
                        value: "text",
                      },
                      {
                        name: "Voz",
                        value: "voice",
                      }
                    )
                )
                .addRoleOption((option) =>
                  option
                    .setName("rol")
                    .setDescription(
                      `El rol que se le dara al usuario al subir de nivel.`
                    )
                    .setRequired(true)
                )
                .addIntegerOption((option) =>
                  option
                    .setName("nivel")
                    .setDescription(`El nivel en el que se le dara el rol.`)
                    .setRequired(true)
                )
            )

            .addSubcommand((command) =>
              command
                .setName("xp-channel")
                .setDescription(
                  `Canal donde se enviaran los mensajes de felicitación por subir de nivel.`
                )
                .addStringOption((option) =>
                  option
                    .setName("modulo")
                    .setDescription(
                      `A que modulo de experiencia quieres configurar el canal`
                    )
                    .addChoices(
                      {
                        name: "Texto",
                        value: "text",
                      },
                      {
                        name: "Voz",
                        value: "voice",
                      }
                    )
                    .setRequired(true)
                )
                .addChannelOption((option) =>
                  option
                    .setName("canal")
                    .setDescription(
                      `El canal donde se enviaran los mensajes de felicitación por subir de nivel.`
                    )
                    .setRequired(true)
                )
            )
            .addSubcommand((command) =>
              command
                .setName("notification")
                .setDescription(
                  `Configura el mensaje de felicitación por subir de nivel.`
                )
                .addStringOption((option) =>
                  option
                    .setName("modulo")
                    .setRequired(true)
                    .setDescription("Que mensaje de modulo quieres configurar")
                    .setChoices(
                      {
                        name: "Mensaje de felicitación al subir de nivel en canales de voz",
                        value: "voice",
                      },
                      {
                        name: "Mensaje de felicitación al subir de nivel en canales de texto",
                        value: "text",
                      }
                    )
                )
            )
        )
        .addSubcommandGroup((group) =>
          group
            .setName("reset")
            .setDescription("Resetea los datos de experiencia")
            .addSubcommand((command) =>
              command
                .setName("server")
                .setDescription(
                  "Resetea el nivel de todos los usuarios del servidor."
                )
                .addStringOption((option) =>
                  option
                    .setName("modulo")
                    .setDescription(
                      "Que modulo de experiencia quieres resetear"
                    )
                    .setRequired(true)
                    .addChoices(
                      {
                        name: "Texto",
                        value: "text",
                      },
                      {
                        name: "Voz",
                        value: "voice",
                      }
                    )
                )
            )
            .addSubcommand((command) =>
              command
                .setName("user")
                .setDescription(`Resetea el nivel de un usuario.`)
                .addStringOption((option) =>
                  option
                    .setName("modulo")
                    .setDescription(
                      `Que modulo de experiencia quieres resetear`
                    )
                    .setRequired(true)
                    .addChoices(
                      {
                        name: "Texto",
                        value: "text",
                      },
                      {
                        name: "Voz",
                        value: "voice",
                      }
                    )
                )
                .addUserOption((option) =>
                  option
                    .setName("usuario")
                    .setDescription(`El usuario que quieres resetear`)
                    .setRequired(true)
                )
            )
        )
    );
  }

  public async chatInputResetExpUser(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const modulo = interaction.options.getString("modulo", true);
    const usuario = interaction.options.getUser("usuario", true);

    switch (modulo) {
      case "text":
        const textUser = await Prisma.usersTextExperienceData.findUnique({
          where: {
            UserID_GuildID: {
              UserID: usuario?.id as string,
              GuildID: interaction.guildId as string,
            },
          },
        });

        if (!textUser) {
          await interaction.reply({
            content: `El usuario \`${usuario?.username}\` no tiene datos de experiencia en el modulo de texto.`,
            ephemeral: true,
          });
          return;
        } else {
          await Prisma.usersTextExperienceData.delete({
            where: {
              UserID_GuildID: {
                UserID: usuario?.id as string,
                GuildID: interaction.guildId as string,
              },
            },
          });
          await interaction.reply({
            content: `Se ha reseteado el nivel del usuario \`${usuario?.username}\` en el modulo de texto. ${config.emojis.success}`,
          });
        }

      case "voice":
        const voiceUser = await Prisma.usersVoiceExperienceData.findUnique({
          where: {
            UserID_GuildID: {
              UserID: usuario?.id as string,
              GuildID: interaction.guildId as string,
            },
          },
        });

        if (!voiceUser) {
          await interaction.reply({
            content: `El usuario \`${usuario?.username}\` no tiene datos de experiencia en el modulo de voz.`,
            ephemeral: true,
          });
          return;
        } else {
          await Prisma.usersVoiceExperienceData.delete({
            where: {
              UserID_GuildID: {
                UserID: usuario?.id as string,
                GuildID: interaction.guildId as string,
              },
            },
          });
          await interaction.reply({
            content: `Se ha reseteado el nivel del usuario \`${usuario?.username}\` en el modulo de voz. ${config.emojis.success}`,
          });
        }

      default:
        break;
    }
  }

  public async chatInputExpRol(interaction: Subcommand.ChatInputCommandInteraction) {
    const modulo = interaction.options.getString("modulo", true);
    const rol = interaction.options.getRole("rol", true);
    const nivel = interaction.options.getInteger("nivel", true);

    switch (modulo) {
      case "text":
        const guildId = interaction.guildId; // Extract guildId separately
        if (guildId) {
          const getRoleAndLevel = await Prisma.textRoleRewards.findUnique({
            where: {
              GuildID_RoleID: {
                GuildID: guildId,
                RoleID: rol.id,
              },
            },
          });

          if (getRoleAndLevel) {
            await interaction.reply({
              content: `El rol \`${rol.name}\` se ha encontrado asignado al nivel: \`${getRoleAndLevel.Nivel}\`. Se ha actualizado a nivel: \`${nivel}\` en canales de texto. ${config.emojis.info}`,
            });
            // const row = new ActionRowBuilder<ButtonBuilder>({
            //   components: [
            //     new ButtonBuilder({
            //       customId: "update-role",
            //       label: "Cambiar",
            //       style: ButtonStyle.Primary,
            //     }),
            //   ],
            // });

            // await interaction.reply({
            //   content: `El rol \`${rol.name}\` ya se encuentra asignado a otro nivel. ¿Quieres cambiarlo?`,
            //   components: [row],
            // });

            await Prisma.textRoleRewards.update({
              where: {
                GuildID_RoleID: {
                  GuildID: guildId,
                  RoleID: rol.id,
                },
              },
              data: {
                Nivel: nivel,
              },
            });
          } else {
            await Prisma.textRoleRewards.create({
              data: {
                GuildID: guildId,
                RoleID: rol.id,
                Nivel: nivel,
              },
            });
          }
          await interaction.reply({
            content: `El rol ${rol.name} se otorgará al subir a nivel \`${nivel}\` en canales de texto ${config.emojis.success}`,
          });
        }
      case "voice":
        const VoiceGuildId = interaction.guildId; // Extract guildId separately
        if (VoiceGuildId) {
          const getRoleAndLevel = await Prisma.voiceRoleRewards.findUnique({
            where: {
              GuildID_RoleID: {
                GuildID: VoiceGuildId,
                RoleID: rol.id,
              },
            },
          });

          if (getRoleAndLevel) {
            await interaction.reply({
              content: `El rol \`${rol.name}\` se ha encontrado asignado a nivel: \`${getRoleAndLevel.Nivel}\`. Se ha actualizado a nivel: \`${nivel}\` en canales de voz. ${config.emojis.info}`,
            });
            // const row = new ActionRowBuilder<ButtonBuilder>({
            //   components: [
            //     new ButtonBuilder({
            //       customId: "update-role",
            //       label: "Cambiar",
            //       style: ButtonStyle.Primary,
            //     }),
            //   ],
            // });

            // await interaction.reply({
            //   content: `El rol \`${rol.name}\` ya se encuentra asignado a otro nivel. ¿Quieres cambiarlo?`,
            //   components: [row],
            // });

            await Prisma.voiceRoleRewards.update({
              where: {
                GuildID_RoleID: {
                  GuildID: VoiceGuildId,
                  RoleID: rol.id,
                },
              },
              data: {
                Nivel: nivel,
              },
            });
          } else {
            await Prisma.voiceRoleRewards.create({
              data: {
                GuildID: VoiceGuildId,
                RoleID: rol.id,
                Nivel: nivel,
              },
            });
          }
          await interaction.reply({
            content: `El rol ${rol.name} se otorgará al subir a nivel \`${nivel}\` en canales de voz ${config.emojis.success}`,
          });
        }

        default:
          break;
    }
  }

  public async chatInputVoiceExpNotification(interaction: Subcommand.ChatInputCommandInteraction) {
    const modulo = interaction.options.getString("modulo", true);

    switch (modulo) {
      case "voice":
        const Modal = new ModalBuilder()
          .setCustomId("vc-message")
          .setTitle("Mensaje de felicitación")
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("voice-message")
                .setLabel("Mensaje de felicitación para niveles en voz")
                .setPlaceholder(
                  "Mensaje de felicitación, usa {user} para mencioanr el usuario."
                )
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(20)
                .setMaxLength(250)
            )
          );
        return await interaction.showModal(Modal);

      case "text":
        const Modal2 = new ModalBuilder()
          .setCustomId("text-message")
          .setTitle("Mensaje de felicitación para niveles en texto")
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("text-message")
                .setLabel("Mensaje de felicitación")
                .setPlaceholder(
                  "Mensaje de felicitación, usa {user} para mencioanr el usuario."
                )
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(20)
                .setMaxLength(250)
            )
          );
        return await interaction.showModal(Modal2);

        default:
          break;
    }
  }

  public async chatInputVoiceExpChannel(interaction: Subcommand.ChatInputCommandInteraction) {
    const modulo = interaction.options.getString("modulo", true);
    const channel = interaction.options.getChannel("canal", true);
    const canal = Client.channels.cache.get(channel.id) as TextChannel;

    switch (modulo) {
      case "voice":
        if (canal.type === ChannelType.GuildText) {
          const getChannel = await Prisma.configChannels.findUnique({
            where: {
              GuildID: interaction.guildId as string,
            },
          });

          if (getChannel) {
            await Prisma.configChannels.update({
              where: {
                GuildID: interaction.guildId as string,
              },
              data: {
                VcXPNotification: canal.id,
              },
            });
          } else {
            await Prisma.configChannels.create({
              data: {
                GuildID: interaction.guildId as string,
                VcXPNotification: canal.id,
              },
            });
          }
          return interaction.reply({
            content: `El canal <#${canal.id}> ha sido configurado para notificar niveles de canales de voz. ${config.emojis.success}`,
          });
        } else {
          return interaction.reply({
            content: `El canal debe ser de texto ${config.emojis.error}`,
            ephemeral: true,
          });
        }

      case "text":
        if (canal.type === ChannelType.GuildText) {
          const getChannel = await Prisma.configChannels.findUnique({
            where: {
              GuildID: interaction.guildId as string,
            },
          });

          if (getChannel) {
            await Prisma.configChannels.update({
              where: {
                GuildID: interaction.guildId as string,
              },
              data: {
                TextXPNotification: canal.id,
              },
            });
          } else {
            await Prisma.configChannels.create({
              data: {
                GuildID: interaction.guildId as string,
                TextXPNotification: canal.id,
              },
            });
          }
          return interaction.reply({
            content: `El canal <#${canal.id}> ha sido configurado para notificar niveles por texto. ${config.emojis.success}`,
          });
        } else {
          return interaction.reply({
            content: `El canal debe ser de texto ${config.emojis.error}`,
            ephemeral: true,
          });
        }

        default:
          break;
    }
  }

  public async chatInputResetExp(interaction: Subcommand.ChatInputCommandInteraction) {
    const modulo = interaction.options.getString("modulo", true);

    switch (modulo) {
      case "text":
        const guildTextExperience =
          await Prisma.usersTextExperienceData.findMany({
            where: {
              GuildID: interaction.guildId as string,
            },
          });

        if (guildTextExperience.length === 0) {
          return interaction.reply({
            content: `No hay datos de experiencia de texto en este servidor ${config.emojis.error}`,
            ephemeral: true,
          });
        }

        await Prisma.usersTextExperienceData.deleteMany({
          where: {
            GuildID: interaction.guildId as string,
          },
        });

        return interaction.reply({
          content: `Se han reseteado los datos de experiencia de texto ${config.emojis.success}`,
        });

      case "voice":
        const guildVoiceExperience =
          await Prisma.usersVoiceExperienceData.findMany({
            where: {
              GuildID: interaction.guildId as string,
            },
          });
        if (guildVoiceExperience.length === 0) {
          return interaction.reply({
            content: `No hay datos de experiencia de voz en este servidor ${config.emojis.error}`,
            ephemeral: true,
          });
        }

        await Prisma.usersVoiceExperienceData.deleteMany({
          where: {
            GuildID: interaction.guildId as string,
          },
        });

        return interaction.reply({
          content: `Se han reseteado los datos de experiencia de voz ${config.emojis.success}`,
        });

        default:
          break;
    }
  }

  public async chatInputExp(interaction: Subcommand.ChatInputCommandInteraction) {
    const modulo = interaction.options.getString("modulo", true);
    const min = interaction.options.getInteger("min", true);
    const max = interaction.options.getInteger("max", true);

    switch (true) {
      case min > max:
        return interaction.reply({
          content: `La experiencia mínima no puede ser mayor a la máxima ${config.emojis.error}`,
          ephemeral: true,
        });
      case min > 100:
        return interaction.reply({
          content: `La experiencia mínima no puede ser mayor a 100 ${config.emojis.error}`,
          ephemeral: true,
        });
      case min === 0:
        return interaction.reply({
          content: `La experiencia mínima no puede ser 0 ${config.emojis.error}`,
          ephemeral: true,
        });
      case max < min:
        return interaction.reply({
          content: `La experiencia máxima no puede ser menor a la mínima ${config.emojis.error}`,
          ephemeral: true,
        });
      case max === 0:
        return interaction.reply({
          content: `La experiencia máxima no puede ser 0 ${config.emojis.error}`,
          ephemeral: true,
        });
      case max > 600:
        return interaction.reply({
          content: `La experiencia máxima no puede ser mayor a 600 ${config.emojis.error}`,
          ephemeral: true,
        });

      default:
        break;
    }

    switch (modulo) {
      case "text":
        const guildData = await Prisma.guildsData.findUnique({
          where: {
            GuildID: interaction.guildId as string,
          },
        });

        if (!guildData) {
          await Prisma.guildsData.create({
            data: {
              GuildID: interaction.guildId as string,
              TextExperienceMin: min,
              TextExperienceMax: max,
            },
          });
        } else {
          await Prisma.guildsData.update({
            where: {
              GuildID: interaction.guildId as string,
            },
            data: {
              TextExperienceMin: min,
              TextExperienceMax: max,
            },
          });
        }

        return interaction.reply({
          content: `La experiencia minima ahora es ${min} y la maxima es ${max} por mensaje. ${config.emojis.success}`,
        });

      case "voice":
        const guildVoiceData = await Prisma.guildsData.findUnique({
          where: {
            GuildID: interaction.guildId as string,
          },
        });

        if (!guildVoiceData) {
          await Prisma.guildsData.create({
            data: {
              GuildID: interaction.guildId as string,
              VoiceExperienceMin: min,
              VoiceExperienceMax: max,
            },
          });
        } else {
          await Prisma.guildsData.update({
            where: {
              GuildID: interaction.guildId as string,
            },
            data: {
              VoiceExperienceMin: min,
              VoiceExperienceMax: max,
            },
          });
        }

        return interaction.reply({
          content: `La experiencia minima ahora es ${min} y la maxima es ${max} para canales de voz. ${config.emojis.success}`,
        });

        default:
          break;
    }
  }

  public async chatInputDisable(interaction: Subcommand.ChatInputCommandInteraction) {
    const modulo = interaction.options.getString("modulo", true);

    switch (modulo) {
      case "text":
        const isDisabledText = await Prisma.guildsData.findUnique({
          where: {
            GuildID: interaction.guildId as string,
          },
        });

        if (isDisabledText?.TextExpEnabled === false) {
          return interaction.reply({
            content: `El sistema de experiencia por texto ya está desactivado ${config.emojis.warning}`,
            ephemeral: true,
          });
        } else {
          await Prisma.guildsData.update({
            where: {
              GuildID: interaction.guildId as string,
            },
            data: {
              TextExpEnabled: false,
            },
          });

          return interaction.reply({
            content: `El sistema de experiencia por texto ha sido desactivado ${config.emojis.success}`,
          });
        }

      case "voice":
        const isDisabledVoice = await Prisma.guildsData.findUnique({
          where: {
            GuildID: interaction.guildId as string,
          },
        });
        if (isDisabledVoice?.VoiceExpEnabled === false) {
          return interaction.reply({
            content: `El sistema de experiencia por voz ya está desactivado ${config.emojis.warning}`,
            ephemeral: true,
          });
        }
        await Prisma.guildsData.update({
          where: {
            GuildID: interaction.guildId as string,
          },
          data: {
            VoiceExpEnabled: false,
          },
        });

        return interaction.reply({
          content: `El sistema de experiencia por voz ha sido desactivado ${config.emojis.success}`,
        });

        default:
          break;
    }
  }

  public async chatInputEnable(interaction: Subcommand.ChatInputCommandInteraction) {
    const modulo = interaction.options.getString("modulo", true);
    switch (modulo) {
      case "text":
        const isEnabledText = await Prisma.guildsData.findUnique({
          where: {
            GuildID: interaction.guildId as string,
          },
        });

        if (isEnabledText?.TextExpEnabled === true) {
          return interaction.reply({
            content: `El sistema de experiencia por texto ya está activado ${config.emojis.warning}`,
            ephemeral: true,
          });
        } else {
          await Prisma.guildsData.update({
            where: {
              GuildID: interaction.guildId as string,
            },
            data: {
              TextExpEnabled: true,
            },
          });

          return interaction.reply({
            content: `El sistema de experiencia por texto ha sido activado ${config.emojis.success}`,
          });
        }

      case "voice":
        const isEnabledVoice = await Prisma.guildsData.findUnique({
          where: {
            GuildID: interaction.guildId as string,
          },
        });

        if (isEnabledVoice?.VoiceExpEnabled === true) {
          return interaction.reply({
            content: `El sistema de experiencia por voz ya está activado ${config.emojis.warning}`,
            ephemeral: true,
          });
        } else {
          await Prisma.guildsData.update({
            where: {
              GuildID: interaction.guildId as string,
            },
            data: {
              VoiceExpEnabled: true,
            },
          });

          return interaction.reply({
            content: `El sistema de experiencia por voz ha sido activado ${config.emojis.success}`,
          });
        }

        default:
          break;
    }
  }
}