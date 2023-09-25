import { Subcommand } from "@sapphire/plugin-subcommands";
import { Time } from "@sapphire/time-utilities";
import { ChatInputCommand } from "@sapphire/framework";
import { Database } from "../../../structures/Database";
import { Utils } from "../../../util/utils";
import { Catto_Coffee } from "../../../Catto";
import { ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, GuildMember, StringSelectMenuBuilder, ButtonBuilder, User } from "discord.js";
const emojis = Utils.getEmojis().VoiceMod

export class AdminSubCommands extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      cooldownDelay: Time.Second * 10,
      name: "mod",
      fullCategory: ["SubCommands"],
      description: "Comandos de moderación",
      preconditions: ["ModOnly"],
      subcommands: [
        {
          name: "vc",
          type: "group",
          entries: [
            { name: "channel", chatInputRun: "ModVcChannel" },
            { name: "user", chatInputRun: "ModVcUser" }
          ]
        },
        {
          name: "notes",
          type: "group",
          entries: [
            { name: "add", chatInputRun: "ModNotesAdd" },
            { name: "info", chatInputRun: "ModNotesInfo" },
            { name: "list", chatInputRun: "ModNotesList" }
          ]
        },
      ],
    });
  }

  registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("mod")
        .setDescription("Moderation commands")
        .setDescriptionLocalizations({
          "es-ES": "Comandos de moderación",
          "pt-BR": "Comandos de moderação"
        })
        .addSubcommandGroup((group) =>
          group
            .setName("vc")
            .setDescription("Voice channel moderation commands")
            .setDescriptionLocalizations({
              "es-ES": "Comandos de moderación de canales de voz",
              "pt-BR": "Comandos de moderação do canal de voz"
            })
            .addSubcommand((command) =>
              command
                .setName("channel")
                .setDescription("Moderation tools for voice channels")
                .setDescriptionLocalizations({
                  "es-ES": "Herramientas de moderación para canales de voz",
                  "pt-BR": "Ferramentas de moderação para canais de voz"
                })
                .addChannelOption((option) =>
                  option
                    .setName("channel")
                    .setNameLocalizations({
                      "es-ES": 'canal',
                      "pt-BR": 'canal',
                    })
                    .setDescription("Channel to monitor")
                    .setDescriptionLocalizations({
                      "es-ES": 'Canal a monitorear',
                      "pt-BR": 'Canal para monitorar',
                    })
                    .setRequired(false)
                )
            )
            .addSubcommand((command) =>
              command
                .setName("user")
                .setDescription("Monitor a user on voice channels")
                .setDescriptionLocalizations({
                  "es-ES": "Monitorea un usuario en los canales de voz",
                  "pt-BR": "Monitore um usuário em canais de voz"
                })
                .addUserOption((option) =>
                  option
                    .setName("user")
                    .setNameLocalizations({
                      "es-ES": "usuario",
                      "pt-BR": "usuário",
                    })
                    .setDescription("Indicates the user to monitor")
                    .setDescriptionLocalizations({
                      "es-ES": "Indica el usuario a monitorear",
                      "pt-BR": "Indica o usuário a monitorar"
                    })
                    .setRequired(true)
                )
            )
        )
        .addSubcommandGroup((group) =>
          group
            .setName("notes")
            .setDescription("poto")
            .addSubcommand((command) =>
              command
                .setName("add")
                .setDescription("Create a new note to a user")
                .setDescriptionLocalizations({
                  "es-ES": "Crea una nueva nota a un usuario",
                  "pt-BR": "Criar uma nova nota para um usuário"
                })
                .addUserOption(option =>
                  option
                    .setName("user")
                    .setNameLocalizations({
                      "es-ES": "usuario",
                      "pt-BR": "usuário",
                    })
                    .setDescription("To which user do you want to attach the note?")
                    .setDescriptionLocalizations({
                      "es-ES": "¿A qué usuario deseas adjuntar la nota?",
                      "pt-BR": "Para qual usuário você deseja anexar a nota?"
                    })
                    .setRequired(true)
                )
                .addStringOption((option) =>
                  option
                    .setName("text")
                    .setNameLocalizations({
                      "es-ES": "texto",
                      "pt-BR": "texto",
                    })
                    .setDescription("Enter a note body")
                    .setDescriptionLocalizations({
                      "es-ES": "Introduzca un cuerpo de nota",
                      "pt-BR": "Digite um corpo de nota"
                    })
                    .setRequired(true)
                )
                .addAttachmentOption(option =>
                  option
                    .setName("attachment1")
                    .setNameLocalizations({
                      "es-ES": "adjunto1",
                      "pt-BR": "anexo1",
                    })
                    .setDescription("Enter a file")
                    .setDescriptionLocalizations({
                      "es-ES": "Introduzca un archivo",
                      "pt-BR": "Insira um arquivo"
                    })
                    .setRequired(false)
                )
                .addAttachmentOption(option =>
                  option
                    .setName("attachment2")
                    .setNameLocalizations({
                      "es-ES": "adjunto2",
                      "pt-BR": "anexo2",
                    })
                    .setDescription("Enter a file")
                    .setDescriptionLocalizations({
                      "es-ES": "Introduzca un archivo",
                      "pt-BR": "Insira um arquivo"
                    })
                    .setRequired(false)
                )
                .addAttachmentOption(option =>
                  option
                    .setName("attachment3")
                    .setNameLocalizations({
                      "es-ES": "adjunto3",
                      "pt-BR": "anexo3",
                    })
                    .setDescription("Enter a file")
                    .setDescriptionLocalizations({
                      "es-ES": "Introduzca un archivo",
                      "pt-BR": "Insira um arquivo"
                    })
                    .setRequired(false)
                )
                .addAttachmentOption(option =>
                  option
                    .setName("attachment4")
                    .setNameLocalizations({
                      "es-ES": "adjunto4",
                      "pt-BR": "anexo4",
                    })
                    .setDescription("Enter a file")
                    .setDescriptionLocalizations({
                      "es-ES": "Introduzca un archivo",
                      "pt-BR": "Insira um arquivo"
                    })
                    .setRequired(false)
                )
                .addAttachmentOption(option =>
                  option
                    .setName("attachment5")
                    .setNameLocalizations({
                      "es-ES": "adjunto5",
                      "pt-BR": "anexo5",
                    })
                    .setDescription("Enter a file")
                    .setDescriptionLocalizations({
                      "es-ES": "Introduzca un archivo",
                      "pt-BR": "Insira um arquivo"
                    })
                    .setRequired(false)
                )
                .addRoleOption(option =>
                  option
                    .setName("restriction")
                    .setNameLocalizations({
                      "es-ES": "restricción",
                      "pt-BR": "restrição"
                    })
                    .setDescription("Indicate the role that will be able to access the note")
                    .setDescriptionLocalizations({
                      "es-ES": "Indique el rol que podrá acceder a la nota",
                      "pt-BR": "Indique o rol que poderá acessar a nota"
                    })
                    .setRequired(false)
                )
            )
            .addSubcommand((command) =>
              command
                .setName("info")
                .setDescription("Get the complete information of a note")
                .setDescriptionLocalizations({
                  "es-ES": "Obtén la información completa de una nota",
                  "pt-BR": "Obtenha as informações completas de uma nota"
                })
                .addIntegerOption(option =>
                  option
                    .setName("id")
                    .setNameLocalizations({
                      "es-ES": "id",
                      "pt-BR": "id",
                    })
                    .setDescription("Enter the ID of the note to review")
                    .setDescriptionLocalizations({
                      "es-ES": "Introduzca la ID de la nota a revisar",
                      "pt-BR": "Digite o ID da nota para revisar"
                    })
                    .setMinValue(0)
                    .setRequired(true)
                )
            )
            .addSubcommand((command) =>
              command
                .setName("list")
                .setDescription("Get the list of notes from a user")
                .setDescriptionLocalizations({
                  "es-ES": "Obtén la lista de notas de un usuario",
                  "pt-BR": "Obter a lista de notas de um usuário"
                })
                .addUserOption(option =>
                  option
                    .setName("user")
                    .setNameLocalizations({
                      "es-ES": "usuario",
                      "pt-BR": "usuário",
                    })
                    .setDescription("Which user do you want to get the list of notes from?")
                    .setDescriptionLocalizations({
                      "es-ES": "¿De qué usuario deseas obtener la lista de notas?",
                      "pt-BR": "De qual usuário você deseja obter a lista de notas?"
                    })
                    .setRequired(true)
                )
            )
        )
    );
  }

  public async ModVcChannel(interaction: Subcommand.ChatInputCommandInteraction) {
    const miembro = interaction.member as GuildMember;
    if (!miembro.permissions.has(PermissionFlagsBits.MuteMembers) || !miembro.permissions.has(PermissionFlagsBits.MoveMembers)) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Parece ser que no dispones de los permisos necesarios para hacer uso de este comando.")
            .setColor("#ed4245")
        ], ephemeral: true
      })
    }

    var channel = interaction.options.getChannel("channel") || miembro.voice.channel;
    if (!channel)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("¡No has especificado ningún canal y no estás conectado a alguno de ellos!")
            .setColor("#ed4245")
        ], ephemeral: true
      })

    try {
      var users: any[] = [];

      const canal: any = Catto_Coffee.channels.resolve(channel.id);
      if (canal && canal.type === 2) {
        const members = canal.members;
        members.forEach((user: any) => {
          users.push(
            `${user.voice.mute
              ? `${user.voice.serverMute ? Utils.getEmojis().VoiceMod.serverMuted : Utils.getEmojis().VoiceMod.selfMuted
              }`
              : Utils.getEmojis().VoiceMod.unmute
            }${user.voice.deaf
              ? `${user.voice.serverDeaf
                ? Utils.getEmojis().VoiceMod.serverDeafen
                : Utils.getEmojis().VoiceMod.selfDeafen
              } `
              : Utils.getEmojis().VoiceMod.undeafen
            } <@${user.id}> ${user.permissions.has(PermissionFlagsBits.MuteMembers)
              ? `${user.permissions.has(PermissionFlagsBits.ManageGuild)
                ? `${Utils.getEmojis().VoiceMod.admin}`
                : `${Utils.getEmojis().VoiceMod.mod}`
              }`
              : ""
            }`
          );
        });
      } else {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Algo me ha impedido acceder a los datos del canal.\nPor favor, comprueba los permisos del bot.")
              .setColor("#ed4245")
          ], ephemeral: true
        })
      }


      const embed = new EmbedBuilder()
        .setDescription(
          `<#${channel.id}>\n\n${users.length > 0
            ? users.slice(0, 30).join("\n")
            : "🦗 \\**Silencio\\**\nNo hay nadie en el canal"
          }`
        )
        .setColor("#313131");
      if (users.length > 30)
        embed.setFooter({
          text: "NO SE HA LOGRADO MOSTRAR A TODOS LOS USUARIOS",
        });

      var disabled = false;
      if (users.length < 1) disabled = true;


      const row = new ActionRowBuilder<StringSelectMenuBuilder>
      const options = await import('../../../interaction-handlers/stringMenu/mod/vcOptCh');
      await options.build(row, { disabled: disabled, author: interaction.user.id }, [channel.id])

      const boton = new ActionRowBuilder<ButtonBuilder>
      const module = await import('../../../interaction-handlers/buttons/mod/vcRfCh');
      await module.build(boton, { disabled: false, author: interaction.user.id }, [channel.id])

      await interaction.reply({
        embeds: [embed],
        components: [row, boton],
      });
    } catch (err) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Algo me ha impedido acceder a los datos del canal.\nPor favor, comprueba los permisos del bot.")
            .setColor("#ed4245")
        ], ephemeral: true
      })
    }
  }

  public async ModVcUser(interaction: Subcommand.ChatInputCommandInteraction) {
    const miembro = interaction.member as GuildMember;

    if (!miembro.permissions.has(PermissionFlagsBits.MuteMembers) || !miembro.permissions.has(PermissionFlagsBits.MoveMembers)) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Parece ser que no dispones de los permisos necesarios para hacer uso de este comando.")
            .setColor("#ed4245")
        ], ephemeral: true
      })
    }

    const user = interaction.options.getMember("user") as GuildMember;
    if (!user)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("El usuario ofrecido no se encuentra en el servidor.")
            .setColor("#ed4245")
        ], ephemeral: true
      })

    var disabled = !user.voice.channel;
    const embed = new EmbedBuilder();

    if (user.voice.channel) {
      var users: any[] = [];

      const canal: any = Catto_Coffee.channels.resolve(user.voice.channel.id);
      if (canal && canal.type === 2) {
        const members = canal.members;
        members.forEach((user: any) => {
          users.push(
            `${user.voice.mute
              ? `${user.voice.serverMute ? emojis.serverMuted : emojis.selfMuted
              }`
              : emojis.unmute
            }${user.voice.deaf
              ? `${user.voice.serverDeaf
                ? emojis.serverDeafen
                : emojis.selfDeafen
              } `
              : emojis.undeafen
            } <@${user.id}> ${user.permissions.has(PermissionFlagsBits.MuteMembers)
              ? `${user.permissions.has(PermissionFlagsBits.ManageGuild)
                ? `${emojis.admin}`
                : `${emojis.mod}`
              }`
              : ""
            }`
          );
        });
      } else {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Algo me ha impedido acceder a los datos del canal.\nPor favor, comprueba los permisos del bot.")
              .setColor("#ed4245")
          ], ephemeral: true
        })
      }

      embed
        .setDescription(
          `**<@${user.id}> se encuentra en <#${user.voice.channel.id
          }>**\n\n${users.slice(0, 30).join("\n")}`
        )
        .setColor("#313131");
      if (users.length > 30)
        embed.setFooter({
          text: "NO SE HA LOGRADO MOSTRAR A TODOS LOS USUARIOS",
        });
    } else {
      embed
        .setDescription("El usuario no se encuentra en ningún canal de voz")
        .setColor("#fb6444");
    }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>
    const options = await import('../../../interaction-handlers/stringMenu/mod/vcOptUr');
    await options.build(row, { disabled: disabled, author: interaction.user.id }, [user.id])

    const boton = new ActionRowBuilder<ButtonBuilder>
    const module = await import('../../../interaction-handlers/buttons/mod/vcRfUr');
    await module.build(boton, { disabled: false, author: interaction.user.id }, [user.id])

    await interaction.reply({
      embeds: [embed],
      components: [row, boton],
    });
  }

  public async ModNotesAdd(interaction: Subcommand.ChatInputCommandInteraction) {

    // Declaramos todos los datos que obtendremos del comando
    const miembro = interaction.member as GuildMember;
    const user = interaction.options.getUser("user");
    const nota = interaction.options.getString("text");
    const rol = interaction.options.getRole("restriction");
    const attachment1 = interaction.options.getAttachment("attachment1");
    const attachment2 = interaction.options.getAttachment("attachment2");
    const attachment3 = interaction.options.getAttachment("attachment3");
    const attachment4 = interaction.options.getAttachment("attachment4");
    const attachment5 = interaction.options.getAttachment("attachment5");

    // Hacemos un array con los adjuntos que existan (Si un adjunto no existe, no lo añade)
    const attachments: any[] = [
      attachment1,
      attachment2,
      attachment3,
      attachment4,
      attachment5
    ].filter((e) => e);

    // Declaramos la ID del servidor
    const guildId = interaction.guild?.id;

    // Comprobamos que el usuario tiene permisos de gestión de mensajes
    if (!miembro.permissions.has(PermissionFlagsBits.ManageMessages))
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("No tienes permisos para usar esta opción.")
            .setColor("#ed4245"),
        ],
        ephemeral: true
      });

    // Si el usuario al que se le añade la nota es un bot devuelve error
    if (user?.bot)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("No se pueden hacer anotaciones a bots")
            .setColor("#ed4245"),
        ],
        ephemeral: true
      });

    // Buscamos todas las otras notas de este usuario
    const that_user_notes: any = await Database.userNotes.findMany({
      where: {
        UserID: user?.id,
        GuildID: guildId
      }
    })

    // Si tiene 25 o más notas, devuelve error
    if (that_user_notes.length >= 25)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Se ha logrado el número máximo de notas que puedes añadir a este usuario.")
            .setColor("#ed4245"),
        ],
        ephemeral: true
      });

    // Buscamos todas las notas del servidor
    const this_guild_notes: any = await Database.userNotes.findMany({
      where: {
        GuildID: guildId
      }
    })

    // Declaramos una ID de nota por defecto
    var new_note_id = 1;

    // Si el servidor tiene más notas, especificaremos una única
    if (this_guild_notes.length > 0) {

      // Colocaremos todas las notas por orden de ID
      const this_guild_notes_sorted = this_guild_notes.sort(function (a: any, b: any) {
        if (a.NoteID < b.NoteID) return -1;
        if (a.noteID > b.noteID) return 1;
        return 0;
      })

      // Buscaremos la última ID usada, y le sumaremos 1
      new_note_id = Math.floor(parseInt(this_guild_notes_sorted[this_guild_notes_sorted.length - 1].NoteID) + 1)
    }

    // Declaramos que el embed de respuesta debe tener este color
    const embed = new EmbedBuilder().setColor("#2b2d31")

    // Añadimos la nota a la base de datos
    await Database.userNotes.create({
      data: {
        NoteID: new_note_id,
        UserID: `${user?.id}`,
        GuildID: `${guildId}`,
        Perpetrator: `${miembro.id}`,
        Unix: `${Date.now()}`,
        Note: `${nota?.replace(/'+/g, "%39%").replace(/\\+/g, "\\\\")}`,
        ReadRoleID: rol ? `${rol.id}` : null
      },
    });

    // Buscamos los canales configurados del servidor
    const this_guild_config_channels = await Database.configChannels.findUnique({
      where: {
        GuildID: guildId
      }
    })

    // Si el servidor tiene un canal de logs de notas...
    if (
      this_guild_config_channels &&
      this_guild_config_channels.NotesLogs &&
      !isNaN(parseInt(this_guild_config_channels.NotesLogs))
    ) {

      // Obtenemos el tamaño de los archivos y el máximo de ellos que se pueden subir sin superar los 25MB
      let size = 0
      let uploaded_number = 0

      // Para ello primero los colocamos por orden de tamaño
      const attachments_sorted = attachments.sort(function (a: any, b: any) {
        if (a.size < b.size) return -1;
        if (a.size > b.size) return 1;
        return 0;
      })

      // Si no hay archivos, no hay más que comprobar
      if (attachments.length > 0) {

        // Si los hay, vamos añadiendo de 1 en 1 el contador de archivos hasta que ya no se pueda sin superar los 25 MB
        attachments_sorted.forEach((attachment) => {
          size += attachment.size
          if (size < 25000000) {
            uploaded_number += 1
          }
        })
      }

      // Obtenemos el canal al que enviaremos el log
      const notes_logs_channel: any = Catto_Coffee.channels.resolve(this_guild_config_channels.NotesLogs)

      // Creamos el mensaje que se enviará como log
      const new_note_log = new EmbedBuilder()
        .setTimestamp()
        .setColor("#57f287")
        .setAuthor({
          name: `${miembro.user.username}${miembro.user.discriminator && parseInt(miembro.user.discriminator) != 0 ? `#${miembro.user.discriminator}` : ""}`,
          iconURL: miembro.user.avatarURL() || "https://archive.org/download/discordprofilepictures/discordgrey.png"
        })
        .setDescription(
          `
          **Miembro:** ${user?.username} (${user?.id})
          **Acción:** Crear nota
          ${rol ? `**Restricciones:** <@&${rol.id}>\n` : ""}${rol ? "" : `**Nota:** ${nota?.replace(/%39%+/g, "'").substring(0, 1800)}`}
          `
        )
        .setFooter({ text: `Nota #${new_note_id}` })

      // Si hay archivos...
      if (size > 0) {

        // Indicaremos que se están subiendo
        embed.setFooter({ text: "Subiendo adjuntos..." })
        await interaction.reply({ embeds: [embed], ephemeral: true })

        // Obtendremos un array con la URL de todos ellos
        let attachments_urls: string[] = []

        // Añadiremos tantas URLs al array como sea posible, gracias a la anterior función
        // con la que calculamos el número máximo de archivos sin lograr los 25MB
        attachments_sorted.forEach((attachment) => {
          if (uploaded_number > 0) {
            attachments_urls.push(attachment.url)
          }
          uploaded_number -= 1
        })

        // Intentaremos enviar este registro
        try {

          // Estableceremos que como no hubo ningún problema, debería haberse enviado
          var sended = true

          // Si hay archivos que adjuntar...
          if (attachments_urls.length > 0) {

            // Enviamos el mensaje con el log y los archivos
            notes_logs_channel
              .send({
                embeds: [new_note_log],
                files: attachments_urls
              })

              // Si no lo logra, especifica que no ha sido posible enviar el mensaje
              .catch(() => {
                sended = false
              })

              // Una vez ejecutada la función, continúa
              .then(async (m: any) => {

                // Si no fue posible enviar el mensaje, cancela
                if (!sended) return;

                // Obtiene un array con los archivos que hay en el mensaje del log
                var fileAttachments = Array.from(
                  m.attachments,
                  function (entry: any) {
                    return { key: entry[0], value: entry[1] };
                  }
                );

                // Obtiene uno a uno cada elemento y lo substituye por su URL
                for (let i = 0; i < fileAttachments.length; i++) {
                  fileAttachments[i] = fileAttachments[i].value.url;
                }

                // Actualiza la base de datos e ingresa las URLs de los adjuntos
                await Database.userNotes.update({
                  where: {
                    NoteID_GuildID: {
                      NoteID: new_note_id,
                      GuildID: `${guildId}`
                    }
                  },
                  data: {
                    AttachmentURL: `${fileAttachments.join(";")}`
                  }
                });

                // Si el tamaño total excede los 25MB informa de que alguno de los adjuntos no ha sido subido
                if (size > 25000000) {
                  embed.setFooter({ text: "Algunos adjuntos no se han podido subir porque se ha sobrepasado el límite de 25MB" })
                }

                // De lo contrario, avisa que todos los adjuntos fueron cargados
                else {
                  embed.setFooter({ text: "¡Todos los adjuntos cargados!" })
                }

                // Actualiza el mensaje
                await interaction.editReply({ embeds: [embed] })
              })
          }

          // Si no hay archivos para adjuntar...
          else {

            // Envía el mensaje de log
            notes_logs_channel
              .send({
                embeds: [new_note_log],
              })
              .then(async (m: any) => {
                embed.setFooter({ text: "No se ha podido subir ninguno de los adjuntos porque todos sobrepasaban los 25MB" })
                await interaction.editReply({ embeds: [embed] })
              })
          }
        }

        // Si falla simplemente indicaremos que no se pudo enviar el log
        catch {
          embed.setFooter({ text: "El bot no ha podido enviar el log" })
        }
      }

      // Si no hay archivos simplemente mandamos el log
      else {
        notes_logs_channel
          .send({
            embeds: [new_note_log],
          })
      }
    }

    // Si no hay canal de logs configurado avisamos de que es necesario para guardar logs y adjuntos
    else {
      embed.setFooter({ text: "Para guardar logs y adjuntos es necesario configurar un canal de logs de notas." })
    }

    const callback24 = (note:any) => parseInt(note.Unix) > (Date.now() as number)-(24000*3600)
    const today = that_user_notes.filter(callback24)

    const callback7 = (note:any) => parseInt(note.Unix) > (Date.now() as number)-(24000*3600*7)
    const week = that_user_notes.filter(callback7)

    // Una vez finalizado, indicamos que la nota ha sido creada exitosamente
    embed.setDescription(`¡Nota \`#${new_note_id}\` creada exitosamente!\n${today.length>0?`\n${Utils.getEmojis().General.Error} \`|\` Esta es la ${today.length +1}ª nota de este usuario hoy.`:`${week.length>0?`\n${Utils.getEmojis().General.Warning} \`|\` Esta es la ${today.length +1}ª nota de este usuario esta semana.`:""}`}${that_user_notes.length > 2?`\n${Utils.getEmojis().General.Warning} \`|\`Esta es la ${that_user_notes.length + 1}ª nota del usuario.`:""}`)
    if (!interaction.deferred) {
      await interaction.reply({ embeds: [embed], ephemeral: true })
    }

    // Registramos la creación de la nota
    this.container.logger.info(`\x1b[32m${miembro.id}\x1b[0m ha añadido la \x1b[33mNOTA#${new_note_id}\x1b[0m a \x1b[32m${user?.id}\x1b[0m en \x1b[36m${interaction.guild?.name} (${guildId})\x1b[0m`)
  }

  public async ModNotesInfo(interaction: Subcommand.ChatInputCommandInteraction) {

    const miembro = interaction.member as GuildMember;
    const noteID = interaction.options.getInteger("id");
    const guildId = interaction.guild?.id;

    if (!miembro.permissions.has(PermissionFlagsBits.ManageMessages))
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("No tienes permisos para usar esta opción.")
            .setColor("#ed4245"),
        ],
        ephemeral: true
      });

    const note = await Database.userNotes.findUnique({
      where: {
        NoteID_GuildID: {
          NoteID: noteID || 1,
          GuildID: `${guildId}`
        }
      }
    })

    if (!note || note?.NoteID != noteID)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Parece ser que esta nota no existe")
            .setColor("#ed4245"),
        ],
        ephemeral: true
      });

    const note_perpetrator = await Catto_Coffee.users.fetch(note.Perpetrator) as User;
    const note_user = await Catto_Coffee.users.fetch(note.UserID) as User;

    var permited = !isNaN(parseInt(note.ReadRoleID || ".")) || note_perpetrator.id == miembro.id || miembro.roles.cache.has(`${note.ReadRoleID}`) || miembro.permissions.has(PermissionFlagsBits.ManageGuild)

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${note_perpetrator.username}${note_perpetrator.discriminator && parseInt(note_perpetrator.discriminator) != 0 ? `#${note_perpetrator.discriminator}` : ""}`,
        iconURL: note_perpetrator.avatarURL() || "https://archive.org/download/discordprofilepictures/discordgrey.png"
      })
      .setFooter({ text: `Nota #${noteID} ${isNaN(parseInt(note.ReadRoleID || ".")) ? "" : `${permited ? "🔓" : "🔒"}`}` })
      .setTimestamp(parseInt(note.Unix))
      .setColor("#2b2d31");

    const urls = note.AttachmentURL?.split(/;+/g)

    if (urls) {
      if (isNaN(parseInt(note.ReadRoleID || ".")) && (urls[0].endsWith(".png") || urls[0].endsWith(".jpg") || urls[0].endsWith(".jpeg") || urls[0].endsWith(".gif"))) {
        embed.setImage(urls[0])
      }
      embed.setDescription(
        `
        **Miembro:** ${note_user.username}${note_user.discriminator && parseInt(note_user.discriminator) != 0 ? `#${note_user.discriminator} (${note.UserID})` : ""}
        ${isNaN(parseInt(note.ReadRoleID || ".")) ? `**Nota:** ${note.Note.replace(/%39%+/g, "'").substring(0, 1800)}\n\nLink de descarga: [${urls[0].split(/\/+/g)[urls[0].split(/\/+/g).length - 1]}](${urls[0]})` : `**Restricciones:** <@&${note.ReadRoleID}>\n`}
        `
      )
    } else {
      embed.setDescription(
        `
        **Miembro:** ${note_user.username}${note_user.discriminator && parseInt(note_user.discriminator) != 0 ? `#${note_user.discriminator} (${note.UserID})` : ""}
        ${isNaN(parseInt(note.ReadRoleID || ".")) ? `**Nota:** ${note.Note.replace(/%39%+/g, "'").substring(0, 1800)}` : `**Restricciones:** <@&${note.ReadRoleID}>\n`}
        `
      )
    }

    const boton = new ActionRowBuilder<ButtonBuilder>
    const boton2 = new ActionRowBuilder<ButtonBuilder>
    const reveal = await import('../../../interaction-handlers/buttons/mod/noteRv');
    const edit = await import('../../../interaction-handlers/buttons/mod/noteEd');
    const remove = await import('../../../interaction-handlers/buttons/mod/noteRmQ');
    const attachments = await import('../../../interaction-handlers/buttons/mod/noteAt');
    if (!isNaN(parseInt(note.ReadRoleID || "."))) {
      await edit.build(boton, { disabled: true, author: interaction.user.id }, [`${note.NoteID}`])
      await reveal.build(boton, { disabled: false, author: interaction.user.id, emoji: "🔓" }, [`${note.NoteID}`])
      await remove.build(boton, { disabled: false, author: interaction.user.id }, [`${note.NoteID}`])
      await interaction.reply({ embeds: [embed], components: [boton] })
    } else {
      await edit.build(boton, { disabled: false, author: interaction.user.id }, [`${note.NoteID}`])
      await reveal.build(boton, { disabled: true, author: interaction.user.id, emoji: "🔒" }, [`${note.NoteID}`])
      await remove.build(boton, { disabled: false, author: interaction.user.id }, [`${note.NoteID}`])
      if (urls && urls.length > 1) {
        await attachments.build(boton2, { disabled: true, author: interaction.user.id, emoji: "⬅️" }, [`${noteID}`, "0", "-1"])
        await attachments.build(boton2, { disabled: false, author: interaction.user.id, emoji: "📁" }, [`${noteID}`, "-1", "0"])
        await attachments.build(boton2, { disabled: false, author: interaction.user.id, emoji: "➡️" }, [`${noteID}`, "0", "1"])
        await interaction.reply({ embeds: [embed], components: [boton2, boton] })
      } else {
        await interaction.reply({ embeds: [embed], components: [boton] })
      }
    }
  }

  public async ModNotesList(interaction: Subcommand.ChatInputCommandInteraction) {
    const miembro = interaction.member as GuildMember;
    const user = interaction.options.getUser("user") as User;
    const guildId = interaction.guild?.id;
    if (!miembro.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("No tienes permisos para usar este comando.")
            .setColor("#ed4245"),
        ],
        ephemeral: true
      })
    }

    const that_user_notes = await Database.userNotes.findMany({
      where: {
        UserID: user.id,
        GuildID: guildId
      }
    })
    const row = new ActionRowBuilder<ButtonBuilder>
    if (that_user_notes.length === 0)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("El usuario no tiene notas.")
            .setColor("#ed4245"),
        ],
        ephemeral: true
      })
    let fields: any[] = [];
    that_user_notes.filter(async (nota) => {
      const note_perpetrator = await Catto_Coffee.users.fetch(nota.Perpetrator) as User;
      return !isNaN(parseInt(nota.ReadRoleID || ".")) || note_perpetrator.id == miembro.id || miembro.roles.cache.has(`${nota.ReadRoleID}`) || miembro.permissions.has(PermissionFlagsBits.ManageGuild)
    }).slice(0, 5).forEach(async (nota) => {
  
      let text = nota.Note.replace(/%39%+/g, "'")
  
      if (text.length > 250) text = text.substring(0, 197) + ` \`[...]\`\n**\`${Math.floor(text.length - 197)} caracteres restantes\`**`
  
      fields.push(
        {
          name: `Nota #${nota.NoteID} ${isNaN(parseInt(nota.ReadRoleID || ".")) ? "" : "`(PRIVADA)`"} ${!nota.AttachmentURL || nota.AttachmentURL == "BLANK" ? "" : "<:attachment:1098012443231396033>"}`,
          value: `${isNaN(parseInt(nota.ReadRoleID || ".")) ? text : "** **"}`
        }
      )
    });
    var pages = Math.floor(that_user_notes.length / 5);
    if (that_user_notes.length % 5 != 0) pages++;

    
    const page = await import('../../../interaction-handlers/buttons/mod/notePage');
    const purge = await import('../../../interaction-handlers/buttons/mod/notePrQ');
    await page.build(row, {disabled: true, author: interaction.user.id, emoji: "⬅️"}, [`${user.id}`, "0", "-1"])
    await purge.build(row, {disabled: false, author: interaction.user.id}, [`${user.id}`])
    await page.build(row, {disabled: that_user_notes.length<=5, author: interaction.user.id, emoji: "➡️"}, [`${user.id}`, "0", "1"])

    if (interaction.deferred) {
      await interaction
        .editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#2b2d31")
              .setTitle("REPOSITORIO DE NOTAS")
              .setAuthor({
                name: `${miembro.user.username}${miembro.user.discriminator && parseInt(miembro.user.discriminator) != 0 ? `#${miembro.user.discriminator}` : ""}`,
                iconURL: miembro.user.avatarURL() || "https://archive.org/download/discordprofilepictures/discordgrey.png"
              })
              .setFooter({
                text: `${that_user_notes.length}/25 notas${pages > 1 ? ` | Página 1/${pages}` : ""
                  }`,
              })
              .setFields(fields),
          ],
          components: [row],
        })
    } else {
      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#2b2d31")
              .setTitle("REPOSITORIO DE NOTAS")
              .setAuthor({
                name: `${miembro.user.username}${miembro.user.discriminator && parseInt(miembro.user.discriminator) != 0 ? `#${miembro.user.discriminator}` : ""}`,
                iconURL: miembro.user.avatarURL() || "https://archive.org/download/discordprofilepictures/discordgrey.png"
              })
              .setFooter({
                text: `${that_user_notes.length}/25 notas${pages > 1 ? ` | Página 1/${pages}` : ""
                  }`,
              })
              .setFields(fields),
          ],
          components: [row],
        })
    }
  }
}