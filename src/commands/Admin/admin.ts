import { Subcommand } from "@sapphire/plugin-subcommands";
import { Time } from "@sapphire/time-utilities";
import { ChatInputCommand } from "@sapphire/framework";
import { Prisma } from "../../client/PrismaClient";
import config from "../../config";
import Client from "../..";
import { ChannelType, TextChannel, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export class AdminSubCommands extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: "admin",
      fullCategory: ["Admin"],
      description: "Comandos de administración",
      requiredClientPermissions: ['Administrator'],
      preconditions: ["AdminOnly"],
      cooldownDelay: Time.Second * 10,
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
            { name: "channel", chatInputRun: "chatInputChannelConfig" },
            { name: "notification", chatInputRun: "chatInputNotification" },
            { name: "rol", chatInputRun: "chatInputExpRol" },
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
        {
          name: 'setup',
          type: 'group',
          entries: [
            {
              name: 'voices',
              chatInputRun: 'chatInputSetupVoices'
            }
          ]
        }
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
            .setName("setup")
            .setDescription("Configuración del sistema de canales temporales")
            .addSubcommand((command) =>
              command
                .setName("voices")
                .setDescription(`Crear el canal de voz para el sistema de canales temporales`)
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
                  `Rol que se le dará al usuario al subir de nivel.`
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
                      `El rol que se le dará al usuario al subir de nivel.`
                    )
                    .setRequired(true)
                )
                .addIntegerOption((option) =>
                  option
                    .setName("nivel")
                    .setDescription(`El nivel en el que se le dará el rol.`)
                    .setRequired(true)
                )
            )

            .addSubcommand((command) =>
              command
                .setName("channel")
                .setDescription(
                  `Canal donde se enviaran los mensajes de felicitación por subir de nivel.`
                )
                .addStringOption((option) =>
                  option
                    .setName("option")
                    .setNameLocalizations({
                      "es-ES": "opción"
                    })
                    .setDescription("To which experience module do you want to configure the channel?")
                    .setDescriptionLocalizations({
                      "es-ES": "A que módulo de experiencia quieres configurar el canal"
                    })
                    .addChoices(
                      {
                        name: "Text levelup",
                        name_localizations: {
                          "es-ES": "Subida de nivel de texto"
                        },
                        value: "xpmsgtext",
                      },
                      {
                        name: "Voice levelup",
                        name_localizations: {
                          "es-ES": "Subida de nivel de voz"
                        },
                        value: "xpmsgvoice",
                      },
                      {
                        name: "Note logs",
                        name_localizations: {
                          "es-ES": "Registros de notas",
                        },
                        value: "notelogs",
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
            .setDescription("Restablece los datos de experiencia")
            .addSubcommand((command) =>
              command
                .setName("server")
                .setDescription(
                  "Restablece el nivel de todos los usuarios del servidor."
                )
                .addStringOption((option) =>
                  option
                    .setName("modulo")
                    .setDescription(
                      "Que modulo de experiencia quieres restablecer"
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
                .setDescription(`Restablece el nivel de un usuario.`)
                .addStringOption((option) =>
                  option
                    .setName("modulo")
                    .setDescription(
                      `Que modulo de experiencia quieres restablecer`
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
                    .setDescription(`El usuario que quieres restablecer`)
                    .setRequired(true)
                )
            )
        )
    );
  }

  public async chatInputSetupVoices(interaction: Subcommand.ChatInputCommandInteraction) {

    const getCategories = await Prisma.configTempChannels.findMany({
      where: {
        GuildID: interaction.guild?.id,
      }
    });

    if (getCategories.length >= 2) {
      return interaction.reply({
        content: `${config.emojis.error} Parece que ya tienes 2 categorías de canales temporales, si deseas crear más, considera adquirir mi versión premium.`,
        ephemeral: true,
      });
    }

    const Guild = interaction.guild;
    const CategoryName = `Crea tu canal`;

    const Category = await Guild?.channels.create({
      name: CategoryName,
      type: 4,
    });

    const ChannelName = `🔉・Únete para Crear`;
    const Channel = await Guild?.channels.create({
      name: ChannelName,
      parent: Category?.id,
      type: 2,
      permissionOverwrites: [
        {
          id: Guild.roles.everyone.id,
          allow: PermissionFlagsBits.Connect,
        },
      ],
    });

    const guildId = Guild?.id ?? '';
    const channelId = Channel?.id ?? '';
    const categoryId = Category?.id ?? '';

    await Prisma.configTempChannels.create({
      data: {
        GuildID: guildId,
        TempVoiceChannelCreate: channelId,
        TempVoiceCategory: categoryId,
      },
    });

    await interaction.reply({
      content: `Se ha configurado el sistema de canales voz temporales exitosamente ${config.emojis.success}. Puedes verificar en <#${Channel?.id}>.`,
    });
  }


  public async chatInputResetExpUser(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const modulo = interaction.options.getString("modulo", true);
    const usuario = interaction.options.getUser("usuario", true);
    try {

      const botond = new ActionRowBuilder<ButtonBuilder>
      const botone = new ActionRowBuilder<ButtonBuilder>
      const module1 = await import('../../interaction-handlers/buttons/general/cancel');
      const module2 = await import('../../interaction-handlers/buttons/admin/rsUrXp');
      await module1.build(botond, { disabled: true, author: interaction.user.id }, [])
      await module2.build(botond, { disabled: true, author: interaction.user.id }, [`${usuario.id}`, modulo])
      await module1.build(botone, { disabled: false, author: interaction.user.id }, [])
      await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${usuario.id}`, modulo])

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("¡No habrá vuelta atrás!")
            .setDescription("¡Estás a punto de reiniciar la XP de <@"+usuario.id+">!")
            .setColor("#2b2d31")
        ],
        components: [botond]
      }).then(() => {
        setTimeout(async function () {
          await interaction.editReply({ components: [botone] })
        }, 3000)
      })
    } catch (err) {
      console.log(err)
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
            content: `El rol \`${rol.name}\` se otorgará al subir a nivel \`${nivel}\` en canales de texto ${config.emojis.success}`,
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

  public async chatInputNotification(interaction: Subcommand.ChatInputCommandInteraction) {
    const modulo = interaction.options.getString("modulo", true);

    switch (modulo) {
      case "voice":
        const VoiceModal = new ModalBuilder()
        .setCustomId("admin:xpvoicemsg")
        .setTitle("Mensaje de felicitación para niveles en voz")
      const voiceInput = new TextInputBuilder()
        .setCustomId("voice-message")
        .setLabel("Mensaje de felicitación")
        .setPlaceholder(`Mensaje de felicitación, usa {user} para mencionar el usuario y {level} para mostrar su nivel.`)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(20)
        .setMaxLength(250)
      const voice = new ActionRowBuilder<TextInputBuilder>().addComponents(voiceInput);
      VoiceModal.addComponents(voice);
      await interaction.showModal(VoiceModal);

      case "text":
        const TextModal = new ModalBuilder()
        .setCustomId("admin:xptxtMsg")
        .setTitle("Mensaje de felicitación para niveles en texto")
      const textInput = new TextInputBuilder()
        .setCustomId("text-message")
        .setLabel("Mensaje de felicitación")
        .setPlaceholder(
          "Mensaje de felicitación, usa {user} para mencionar el usuario y {level} para mostrar su nivel."
        )
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(20)
        .setMaxLength(250)
      const text = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);
      TextModal.addComponents(text);
      await interaction.showModal(TextModal);
      default:
        break;
    }
  }

  public async chatInputResetExp(interaction: Subcommand.ChatInputCommandInteraction) {
    const modulo = interaction.options.getString("modulo", true);

    const modal = await import("../../interaction-handlers/modals/admin/rsSvXp")
    modal.build(interaction, modulo)
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

  public async chatInputChannelConfig(interaction: Subcommand.ChatInputCommandInteraction) {

    const modulo = interaction.options.getString("option", true);
    const channel = interaction.options.getChannel("canal", true);
    const canal = Client.channels.cache.get(channel.id) as TextChannel;

    switch (modulo) {
      case "xpmsgvoice":
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

      case "xpmsgtext":
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

      case "notelogs":
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
                NotesLogs: canal.id,
              },
            });
          } else {
            await Prisma.configChannels.create({
              data: {
                GuildID: interaction.guildId as string,
                NotesLogs: canal.id,
              },
            });
          }
          return interaction.reply({
            content: `El canal <#${canal.id}> ha sido configurado para notificar logs de notas. ${config.emojis.success}`,
          });
        } else {
          return interaction.reply({
            content: `El canal debe ser de texto ${config.emojis.error}`,
            ephemeral: true,
          });
        }

      default:
        return interaction.reply({
          content: `Opción no reconocida ${config.emojis.error}`,
          ephemeral: true,
        });

    }

  }
}