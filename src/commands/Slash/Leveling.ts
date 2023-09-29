import { Subcommand } from "@sapphire/plugin-subcommands";
import { createCanvas, loadImage, registerFont } from 'canvas';
import { Time } from "@sapphire/time-utilities";
import { ChatInputCommand } from "@sapphire/framework";
import { AttachmentBuilder, Guild } from "discord.js";
import { Database } from "../../structures/Database";
import { Utils } from "../../util/utils";
import { XPCalculator, formatNumber } from "../../util/utilities";
import { Verify } from "../../util/utilities/Classes/Verify";
import { CattoLogger } from "../../structures/CattoLogger";
const logger = new CattoLogger();
const Verification = new Verify()
const { Emojis } = Utils;
export class LevelingSubcommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      preconditions: ["GuildOnly"],
      name: "level",
      description: "Comandos de experiencia",
      cooldownDelay: Time.Second * 10,
      requiredClientPermissions: ['Administrator'],
      requiredUserPermissions: ['SendMessages'],
      subcommands: [
        {
          name: "rank",
          chatInputRun: "chatInputRank",
        },
        {
          name: "leaderboard",
          chatInputRun: "chatInputLadderboard",
        },
        {
          name: "rewards",
          chatInputRun: "chatInputRewards",
        },
        {
          name: "set",
          type: "group",
          entries: [
            {
              name: "level",
              chatInputRun: "chatInputSetLevelXP",
            },
          ],
        },
      ],
    });
  }

  registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("xp")
        .setDescription("Comandos de experiencia")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("rank")
            .setDescription("Muestra el rank de experiencia")
            .addStringOption((option) =>
              option
                .setName("tipo")
                .setRequired(true)
                .setDescription("¿Qué tipo de rank quieres ver?")
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
                .setName("user")
                .setDescription("Muestra el rank de experiencia de un usuario")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("leaderboard")
            .setDescription("Muestra la tabla de usuarios con más experiencia")
            .addStringOption((option) =>
              option
                .setRequired(true)
                .setName("tipo")
                .setDescription("¿Qué tipo de ladderboard quieres ver?")
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
        .addSubcommand((subcommand) =>
          subcommand
            .setName("rewards")
            .setDescription("Muestra los roles obtenibles por nivel.")
            .addStringOption((option) =>
              option
                .setRequired(true)
                .setName("tipo")
                .setDescription("¿Qué tipo de roles quieres ver?")
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
        .addSubcommandGroup((group) =>
          group
            .setName("set")
            .setDescription(
              "Comandos para establecer la experiencia de un usuario"
            )
            .addSubcommand((subcommand) =>
              subcommand
                .setName("level")
                .setDescription("Establece el nivel de un usuario")
                .addStringOption((option) =>
                  option
                    .setRequired(true)
                    .setName("tipo")
                    .setDescription(
                      "¿Qué tipo de experiencia quieres establecer?"
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
                )
                .addUserOption((option) =>
                  option
                    .setName("user")
                    .setDescription(
                      "Usuario al que se le va a establecer su nivel."
                    )
                    .setRequired(true)
                )
                .addIntegerOption((option) =>
                  option
                    .setName("level")
                    .setDescription(
                      "Nivel que se le va a establecer al usuario."
                    )
                    .setRequired(true)
                )
            )
        )
    );
  }



  public registeringFONT() {
    (registerFont)('./dist/assets/fonts/Poppins-SemiBold.ttf', { family: 'Poppins SemiBold' });
    (registerFont)('./dist/assets/fonts/Poppins-Bold.ttf', { family: 'Poppins Bold' });
    (registerFont)('./dist/assets/fonts/Bahnschrift.ttf', { family: 'Bahnschrift' });
  }

  public async chatInputSetLevelXP(interaction: Subcommand.ChatInputCommandInteraction) {
    if (!interaction.memberPermissions?.has('ManageRoles')) {
      return interaction.reply({
        content: `No tienes permisos para usar este comando. ${Emojis.General.Error} permiso requerido: \`Manage Roles\``,
        ephemeral: true,
      });
    }

    const tipo = interaction.options.getString("tipo");
    const user = interaction.options.getUser("user");
    const nivel = interaction.options.getInteger("level");

    const nivelValue = (nivel as number) ?? 0;

    if (nivelValue > 100) {
      return interaction.reply({
        content: `El nivel no puede ser mayor a 100. ${Emojis.General.Error}`,
        ephemeral: true,
      });
    }

    if (nivelValue < 0) {
      return interaction.reply({
        content: `El nivel no puede ser menor a 0.  ${Emojis.General.Error}`,
        ephemeral: true,
      });
    }

    let TotalGeneralExperience = 0;
    for (let i = 0; i < nivelValue; i++) {
      TotalGeneralExperience += XPCalculator(i);
    }

    switch (tipo) {
      case "text":
        if (await Verification.verifyEnableText(interaction.guild as Guild, interaction)) {
          return;
        } else {
          await interaction.reply({
            content: `<a:loading:1128207815073333341>`,
          })
          const textUser = await Database.usersTextExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                UserID: user?.id as string,
                GuildID: interaction.guildId as string,
              },
            },
          });

          if (!textUser) {
            await Database.usersTextExperienceData.create({
              data: {
                UserID: user?.id as string,
                GuildID: interaction.guildId as string,
                TotalExperience: Math.round(TotalGeneralExperience),
                Nivel: nivelValue,
              },
            });
          } else {
            await Database.usersTextExperienceData.update({
              where: {
                UserID_GuildID: {
                  UserID: user?.id as string,
                  GuildID: interaction.guildId as string,
                },
              },
              data: {
                TotalExperience: Math.round(TotalGeneralExperience),
                Nivel: nivelValue,
              },
            });
          }

          const textRoles = await Database.textRoleRewards.findMany({
            where: {
              GuildID: interaction.guildId as string,
              Nivel: {
                lte: nivelValue, // Obtener roles con nivel menor o igual al nivel del usuario
              },
            },
          });

          let roleNames = [];
          for (let i = 0; i < textRoles.length; i++) {
            const RoleID = textRoles[i].RoleID;
            const Role = interaction.guild?.roles.cache.get(RoleID);
            if (Role) {
              await interaction.guild?.members.cache.get(user?.id as string)?.roles.add(Role);
              roleNames.push(Role.name);
            }
          }

          const roleNamesString = roleNames.join(', ');
          return interaction.editReply({
            content: `Se ha establecido el nivel de \`${user?.username}\` a \`${nivelValue}\` en canales de texto.  y se han agregado los roles correspondientes. (\`${roleNamesString}\`)`,
          });
        }

      case "voice":
        if (await Verification.verifyEnableVoice(interaction.guild!, interaction)) {
          return;
        } else {
          await interaction.reply({
            content: `<a:loading:1128207815073333341>`,
          })
          const voiceUser = await Database.usersVoiceExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                UserID: user?.id as string,
                GuildID: interaction.guildId as string,
              },
            },
          });

          if (!voiceUser) {
            await Database.usersVoiceExperienceData.create({
              data: {
                UserID: user?.id as string,
                GuildID: interaction.guildId as string,
                TotalExperience: Math.round(TotalGeneralExperience),
                Nivel: nivelValue,
              },
            });
          } else {
            await Database.usersVoiceExperienceData.update({
              where: {
                UserID_GuildID: {
                  UserID: user?.id as string,
                  GuildID: interaction.guildId as string,
                },
              },
              data: {
                TotalExperience: Math.round(TotalGeneralExperience),
                Nivel: nivelValue,
              },
            });
          }

          const voiceRoles = await Database.voiceRoleRewards.findMany({
            where: {
              GuildID: interaction.guildId as string,
              Nivel: {
                lte: nivelValue, // Obtener roles con nivel menor o igual al nivel del usuario
              },
            },
          });

          let roleNames = [];
          for (let i = 0; i < voiceRoles.length; i++) {
            const RoleID = voiceRoles[i].RoleID;
            const Role = interaction.guild?.roles.cache.get(RoleID);
            if (Role) {
              await interaction.guild?.members.cache.get(user?.id as string)?.roles.add(Role);
              roleNames.push(Role.name);
            }
          }

          const roleNamesString = roleNames.join(', ');
          return interaction.editReply({
            content: `Se ha establecido el nivel de \`${user?.username}\` a \`${nivelValue}\` en canales de voz. y se han agregado los roles correspondientes. (\`${roleNamesString}\`)`,
          });
        }

      default:
        break;
    }
  }

  public async chatInputRewards(interaction: Subcommand.ChatInputCommandInteraction) {
    const tipo = interaction.options.getString("tipo") ?? "text";
    switch (tipo) {
      case "text":
        if (await Verification.verifyEnableText(interaction.guild as Guild, interaction)) {
          return;
        } else {
          const TextRewards = await Database.textRoleRewards.findMany({
            where: {
              GuildID: interaction.guildId as string,
            },
          });

          if (TextRewards.length === 0) {
            return interaction.reply({
              content: `Parece que en este servidor no hay roles registrados en \`Canales de Texto\`.`,
              ephemeral: true,
            });
          } else {
            TextRewards.sort((a, b) => a.Nivel - b.Nivel); // Ordenar roles por nivel

            let text = TextRewards.map((r) => {
              return `Nivel: \`${r.Nivel}\` ➜ <@&${r.RoleID}>`;
            });

            return Utils.interactionEmbed(interaction, `\n\n${text.join("\n")}`);
          }
        }

      case "voice":
        if (await Verification.verifyEnableVoice(interaction.guild!, interaction)) {
          return;
        } else {
          const VoiceRewards = await Database.voiceRoleRewards.findMany({
            where: {
              GuildID: interaction.guildId as string,
            },
          });

          if (VoiceRewards.length === 0) {
            return interaction.reply({
              content: `Parece que en este servidor no hay roles registrados en \`Canales de Voz\`.`,
              ephemeral: true,
            });
          } else {
            VoiceRewards.sort((a, b) => a.Nivel - b.Nivel); // Ordenar roles por nivel

            let text = VoiceRewards.map((r) => {
              return `Nivel: \`${r.Nivel}\` ➜ <@&${r.RoleID}>`;
            });

            return Utils.interactionEmbed(interaction, `\n\n${text.join("\n")}`);
          }
        }

      default:
        break;
    }
  }

  public async chatInputLadderboard(interaction: Subcommand.ChatInputCommandInteraction) {
    try {
      this.registeringFONT();
      const tipo = interaction.options.getString("tipo") ?? "text";
      switch (tipo) {
        case "text":

          if (await Verification.verifyEnableText(interaction.guild as Guild, interaction)) {
            return;
          } else {
            const TextLadderboard = await Database.usersTextExperienceData.findMany({
              where: {
                GuildID: interaction.guildId as string,
              },
              take: 150
            });

            if (TextLadderboard.length === 0) {
              return interaction.reply({
                content: `Parece que en este servidor no hay usuarios con experiencia registrada en \`Canales de Texto\`. ${Emojis.General.Error}`,
                ephemeral: true,
              });
            } else {
              await interaction.reply({
                content: `<a:loading:1128207815073333341>`,
              });
              let rank = await Database.usersTextExperienceData.findMany({
                where: {
                  GuildID: interaction.guildId as string,
                },
                orderBy: {
                  TextExperience: "desc",
                }
              });

              let sorted = rank.sort((a, b) => {
                if (a.Nivel === b.Nivel) {
                  return b.TextExperience - a.TextExperience;
                } else {
                  return b.Nivel - a.Nivel;
                }
              });

              let currentRank = sorted.findIndex((u) => u.UserID === interaction.user.id) + 1;
              let formattedRank = formatNumber(currentRank);

              let currentUserData = rank.find((u) => u.UserID === interaction.user.id);
              if (!currentUserData) {
                // Establecer los valores predeterminados como 0 si no se encuentra el usuario en la lista
                currentUserData = {
                  UserID: interaction.user.id,
                  GuildID: interaction.guildId,
                  Nivel: 0,
                  TextExperience: 0,
                  TotalExperience: 0
                };
              }


              // Obtén los valores de Nivel y XP del usuario actual
              const currentUserLevel = currentUserData.Nivel;
              const currentUserXP = currentUserData.TextExperience;
              let ladderboard = sorted.slice(0, 10);
              let text = await Promise.all(ladderboard.map(async (u, i) => {
                const member = await interaction.client.users.fetch(u.UserID);
                const formattedXP = formatNumber(u.TextExperience); // Formatear XP usando la función formatNumber
                return `${member.username} \nNivel: ${u.Nivel} - XP: ${formattedXP}`;
              }));

              const backgroundImage = './dist/assets/img/Catto_Leader_TXT.png'; // URL de la imagen de fondo

              // const backgroundImage = './assets/img/Catto_Leader_TXT.png';
              const imageWidth = 1024; // Ancho de la imagen de fondo
              const imageHeight = 1440; // Alto de la imagen de fondo
              const background = await (loadImage)(backgroundImage);
              const canvas = (createCanvas)(imageWidth, imageHeight);

              const context = canvas.getContext('2d');

              context.drawImage(background, 0, 0, canvas.width, canvas.height);
              let y = Math.floor(imageHeight / 20);
              const lineHeight = Math.floor(imageHeight / 10);
              // Obtener los avatares de los usuarios
              const avatars = await Promise.all(ladderboard.map(async (u) => {
                const member = await interaction.client.users.fetch(u.UserID);
                const avatarURL = member.displayAvatarURL({ extension: 'png', size: 128 });
                return (loadImage)(avatarURL);
              }));

              function drawRoundedImage(context, image, x, y, size) {
                context.save();
                context.beginPath();
                context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
                context.closePath();
                context.clip();
                context.drawImage(image, x, y, size, size);
                context.restore();
              }

              function isMultipleDigits(num) {
                return num >= 10 || num <= -10;
              }

              function drawFormattedRank(context, rank, x, y) {
                context.font = '30px Bahnschrift';
                context.fillStyle = '#A8A8A8';
                context.textAlign = 'left';
                if (isMultipleDigits(rank)) {
                  // Ajustar la posición si el rango tiene varios dígitos
                  x -= 1.5;
                }
                else if (rank.includes('K')) {
                  // Ajustar la posición si el rango está en miles
                  x -= 3;
                }
                context.fillText(rank, x, y);
              }
              // Obtén el avatar del usuario que usa el comando
              const userAvatarURL = interaction.user.displayAvatarURL({ extension: 'png', size: 128 });
              const userAvatar = await (loadImage)(userAvatarURL);
              // Función para dibujar el avatar del usuario
              function drawUserAvatar(context, image, x, y, size) {
                context.save();
                context.beginPath();
                context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
                context.closePath();
                context.clip();
                context.drawImage(image, x, y, size, size);
                context.restore();
              }
              // Función para dibujar los datos del usuario
              function drawUserData(context, username, level, xp, x, y) {
                context.font = '16px Poppins SemiBold';
                context.fillStyle = '#000000';
                context.textAlign = 'left';
                context.fillText(username + ' (Tú)', x, y + 12);
                context.fillText(`Nivel: ${level}`, x, y + 32);
                context.fillText(`XP: ${xp}`, x + 650, y + 10);
              }
              const avatarSize = Math.floor(imageHeight / 15);
              const avatarSpacing = Math.floor(imageHeight / 20);
              function drawProgressBar(context, x, y, width, height, progress) {
                // Empty bar
                context.fillStyle = '#BEBEBE';
                context.fillRect(x, y, width, height);
                // Filled bar
                const gradient = context.createLinearGradient(x, y, x + width, y);
                gradient.addColorStop(0, '#12D6DF');
                gradient.addColorStop(1, '#F70FFF');
                context.lineJoin = 'round';
                context.fillStyle = gradient;
                context.fillRect(x, y, width * progress, height);
              }
              function drawProgressBarForUser(context, progress, x, y, width, height) {
                // Empty bar
                context.fillStyle = '#BEBEBE';
                context.fillRect(x, y, width, height);
                // Filled bar
                const gradient = context.createLinearGradient(x, y, x + width, y);
                gradient.addColorStop(0, '#12D6DF');
                gradient.addColorStop(1, '#F70FFF');
                context.lineJoin = 'round';
                context.fillStyle = gradient;
                context.fillRect(x, y, width * progress, height);
              }
              text.forEach((line, i) => {
                const avatar = avatars[i];
                const avatarX = imageWidth * 0.06 + imageWidth * 0.06;
                const avatarY = y + lineHeight / 2 - avatarSize / 2;
                drawRoundedImage(context, avatar, avatarX, avatarY, avatarSize);
                const textX = avatarX + avatarSize + Math.floor(imageWidth * 0.03);
                const textY = avatarY + avatarSize / 2 + 6 - Math.floor(imageHeight * 0.02);
                const [username, xp] = line.split(' - XP: ');
                context.font = '16px Poppins SemiBold';
                context.fillStyle = '#000000';
                context.textAlign = 'left';
                context.fillText(username, textX, textY);
                const xpTextWidth = context.measureText(xp).width;
                const xpX = imageWidth - Math.floor(imageWidth * 0.09) - xpTextWidth;
                context.fillText('XP: ' + xp, xpX, textY);
                const progress = ladderboard[i].TextExperience / (XPCalculator)(ladderboard[i].Nivel);
                const progressBarX = textX; // Ajustar la posición X de la barra de progreso
                const progressBarY = textY + 30; // Ajustar la posición Y de la barra de progreso
                const progressBarWidth = 720;
                const progressBarHeight = 20;
                drawProgressBar(context, progressBarX, progressBarY, progressBarWidth, progressBarHeight, progress);
                y += lineHeight + avatarSpacing - avatarSize;
              });
              const userAvatarSize = Math.floor(imageHeight / 15);
              const userAvatarX = imageWidth * 0.06 + imageWidth * 0.06;
              const userAvatarY = y + lineHeight / 2 - userAvatarSize / 2;
              drawUserAvatar(context, userAvatar, userAvatarX, userAvatarY, userAvatarSize);
              const rankX = userAvatarX - Math.floor(imageWidth * 0.04) - context.measureText(formattedRank).width - 2;
              const rankY = userAvatarY + userAvatarSize / 2 + 6 + 4;
              drawFormattedRank(context, formattedRank, rankX, rankY);
              const userDataX = userAvatarX + userAvatarSize + Math.floor(imageWidth * 0.03);
              const userDataY = userAvatarY + 20;
              drawUserData(context, interaction.user.username, formatNumber(currentUserLevel), formatNumber(currentUserXP), userDataX, userDataY);
              const progressForUser = currentUserXP / (XPCalculator)(currentUserLevel);
              const progressBarForUserX = userDataX; // Ajustar la posición X de la barra de progreso para el usuario que invoca la interacción
              const progressBarForUserY = userDataY + 40; // Ajustar la posición Y de la barra de progreso para el usuario que invoca la interacción
              const progressBarForUserWidth = 720; // Ajustar el ancho de la barra de progreso para el usuario que invoca la interacción
              const progressBarForUserHeight = 20; // Ajustar la altura de la barra de progreso para el usuario que invoca la interacción
              drawProgressBarForUser(context, progressForUser, progressBarForUserX, progressBarForUserY, progressBarForUserWidth, progressBarForUserHeight);
              const buffer = canvas.toBuffer('image/png');

              return interaction.editReply({
                files: [buffer],
                content: ''
              });
            }
          }


        case "voice":
          if (await Verification.verifyEnableVoice(interaction.guild, interaction)) {
            return;
          }
          else {
            const VoiceLeaderboard = await Database.usersVoiceExperienceData.findMany({
              where: {
                GuildID: interaction.guildId,
              }
            });
            if (VoiceLeaderboard.length === 0) {
              return interaction.reply({
                content: `Parece que en este servidor no hay usuarios con experiencia registrada en \`Canales de Voz\`. ${Emojis.General.Error}`,
                ephemeral: true,
              });
            }
            else {
              await interaction.reply({
                content: `<a:loading:1128207815073333341>`,
              });
              let rank = await Database.usersVoiceExperienceData.findMany({
                where: {
                  GuildID: interaction.guildId,
                },
                orderBy: {
                  VoiceExperience: "desc",
                }
              });
              let sorted = rank.sort((a, b) => {
                if (a.Nivel === b.Nivel) {
                  return b.VoiceExperience - a.VoiceExperience;
                }
                else {
                  return b.Nivel - a.Nivel;
                }
              });
              let currentRank = sorted.findIndex((u) => u.UserID === interaction.user.id) + 1;
              let formattedRank = formatNumber(currentRank);
              let currentUserData = rank.find((u) => u.UserID === interaction.user.id);
              if (!currentUserData) {
                // Establecer los valores predeterminados como 0 si no se encuentra el usuario en la lista
                currentUserData = {
                  UserID: interaction.user.id,
                  GuildID: interaction.guildId,
                  Nivel: 0,
                  VoiceExperience: 0,
                  TotalExperience: 0
                };
              }
              const currentUserLevel = currentUserData.Nivel;
              const currentUserXP = currentUserData.VoiceExperience;
              let ladderboard = sorted.slice(0, 10);
              let text = await Promise.all(ladderboard.map(async (u, i) => {
                const member = await interaction.client.users.fetch(u.UserID);
                const formattedXP = formatNumber(u.VoiceExperience); // Formatear XP usando la función formatNumber
                return `${member.username} \nNivel: ${u.Nivel} - XP: ${formattedXP}`;
              }));
              const backgroundImage = './dist/assets/img/Catto_Leader_TXT.png'; // URL de la imagen de fondo
              const imageWidth = 1024; // Ancho de la imagen de fondo
              const imageHeight = 1440; // Alto de la imagen de fondo
              const background = await (loadImage)(backgroundImage);
              const canvas = (createCanvas)(imageWidth, imageHeight);
              const context = canvas.getContext('2d');
              context.drawImage(background, 0, 0, canvas.width, canvas.height);
              let y = Math.floor(imageHeight / 20);
              const lineHeight = Math.floor(imageHeight / 10);
              // Obtener los avatares de los usuarios
              const avatars = await Promise.all(ladderboard.map(async (u) => {
                const member = await interaction.client.users.fetch(u.UserID);
                const avatarURL = member.displayAvatarURL({ extension: 'png', size: 128 });
                return (loadImage)(avatarURL);
              }));
              // Función para dibujar una imagen redondeada (avatar)
              function drawRoundedImage(context, image, x, y, size) {
                context.save();
                context.beginPath();
                context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
                context.closePath();
                context.clip();
                context.drawImage(image, x, y, size, size);
                context.restore();
              }
              // Función para verificar si un número tiene más de un dígito
              function isMultipleDigits(num) {
                return num >= 10 || num <= -10;
              }
              // Función para dibujar el texto del rango
              function drawFormattedRank(context, rank, x, y) {
                context.font = '30px Bahnschrift';
                context.fillStyle = '#A8A8A8';
                context.textAlign = 'left';
                if (isMultipleDigits(rank)) {
                  // Ajustar la posición si el rango tiene varios dígitos
                  x -= 1.5;
                }
                else if (rank.includes('K')) {
                  // Ajustar la posición si el rango está en miles
                  x -= 3;
                }
                context.fillText(rank, x, y);
              }
              // Obtén el avatar del usuario que usa el comando
              const userAvatarURL = interaction.user.displayAvatarURL({ extension: 'png', size: 128 });
              const userAvatar = await (loadImage)(userAvatarURL);
              // Función para dibujar el avatar del usuario
              function drawUserAvatar(context, image, x, y, size) {
                context.save();
                context.beginPath();
                context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
                context.closePath();
                context.clip();
                context.drawImage(image, x, y, size, size);
                context.restore();
              }
              // Función para dibujar los datos del usuario
              function drawUserData(context, username, level, xp, x, y) {
                context.font = '16px Poppins SemiBold';
                context.fillStyle = '#000000';
                context.textAlign = 'left';
                context.fillText(username + ' (Tú)', x, y + 12);
                context.fillText(`Nivel: ${level}`, x, y + 32);
                context.fillText(`XP: ${xp}`, x + 650, y + 10);
              }
              const avatarSize = Math.floor(imageHeight / 15);
              const avatarSpacing = Math.floor(imageHeight / 20);
              function drawProgressBar(context, x, y, width, height, progress) {
                // Empty bar
                context.fillStyle = '#BEBEBE';
                context.fillRect(x, y, width, height);
                // Filled bar
                const gradient = context.createLinearGradient(x, y, x + width, y);
                gradient.addColorStop(0, '#12D6DF');
                gradient.addColorStop(1, '#F70FFF');
                context.lineJoin = 'round';
                context.fillStyle = gradient;
                context.fillRect(x, y, width * progress, height);
              }
              function drawProgressBarForUser(context, progress, x, y, width, height) {
                // Empty bar
                context.fillStyle = '#BEBEBE';
                context.fillRect(x, y, width, height);
                // Filled bar
                const gradient = context.createLinearGradient(x, y, x + width, y);
                gradient.addColorStop(0, '#12D6DF');
                gradient.addColorStop(1, '#F70FFF');
                context.lineJoin = 'round';
                context.fillStyle = gradient;
                context.fillRect(x, y, width * progress, height);
              }
              text.forEach((line, i) => {
                const avatar = avatars[i];
                const avatarX = imageWidth * 0.06 + imageWidth * 0.06;
                const avatarY = y + lineHeight / 2 - avatarSize / 2;
                drawRoundedImage(context, avatar, avatarX, avatarY, avatarSize);
                const textX = avatarX + avatarSize + Math.floor(imageWidth * 0.03);
                const textY = avatarY + avatarSize / 2 + 6 - Math.floor(imageHeight * 0.02);
                const [username, xp] = line.split(' - XP: ');
                context.font = '16px Poppins SemiBold';
                context.fillStyle = '#000000';
                context.textAlign = 'left';
                context.fillText(username, textX, textY);
                const xpTextWidth = context.measureText(xp).width;
                const xpX = imageWidth - Math.floor(imageWidth * 0.09) - xpTextWidth;
                context.fillText('XP: ' + xp, xpX, textY);
                const progress = ladderboard[i].VoiceExperience / (XPCalculator)(ladderboard[i].Nivel);
                const progressBarX = textX; // Ajustar la posición X de la barra de progreso
                const progressBarY = textY + 30; // Ajustar la posición Y de la barra de progreso
                const progressBarWidth = 720;
                const progressBarHeight = 20;
                drawProgressBar(context, progressBarX, progressBarY, progressBarWidth, progressBarHeight, progress);
                y += lineHeight + avatarSpacing - avatarSize;
              });
              const userAvatarSize = Math.floor(imageHeight / 15);
              const userAvatarX = imageWidth * 0.06 + imageWidth * 0.06;
              const userAvatarY = y + lineHeight / 2 - userAvatarSize / 2;
              drawUserAvatar(context, userAvatar, userAvatarX, userAvatarY, userAvatarSize);
              const rankX = userAvatarX - Math.floor(imageWidth * 0.04) - context.measureText(formattedRank).width - 2;
              const rankY = userAvatarY + userAvatarSize / 2 + 6 + 4;
              drawFormattedRank(context, formattedRank, rankX, rankY);
              const userDataX = userAvatarX + userAvatarSize + Math.floor(imageWidth * 0.03);
              const userDataY = userAvatarY + 20;
              drawUserData(context, interaction.user.username, formatNumber(currentUserLevel), formatNumber(currentUserXP), userDataX, userDataY);
              const progressForUser = currentUserXP / (XPCalculator)(currentUserLevel);
              const progressBarForUserX = userDataX; // Ajustar la posición X de la barra de progreso para el usuario que invoca la interacción
              const progressBarForUserY = userDataY + 40; // Ajustar la posición Y de la barra de progreso para el usuario que invoca la interacción
              const progressBarForUserWidth = 720; // Ajustar el ancho de la barra de progreso para el usuario que invoca la interacción
              const progressBarForUserHeight = 20; // Ajustar la altura de la barra de progreso para el usuario que invoca la interacción
              drawProgressBarForUser(context, progressForUser, progressBarForUserX, progressBarForUserY, progressBarForUserWidth, progressBarForUserHeight);
              const buffer = canvas.toBuffer('image/png');
              return interaction.editReply({
                files: [buffer],
                content: ''
              });
            }
          }

        default:
          break;
      }
    } catch (error) {
      logger.error(error)
    }

  }

  public async chatInputRank(interaction: Subcommand.ChatInputCommandInteraction) {
    this.registeringFONT();
    const tipo = interaction.options.getString("tipo") ?? "text";
    const user = interaction.options.getUser("user") ?? interaction.user;
    if (user.bot) {
      return interaction.reply({
        content: `Los bots no pueden recibir experiencia ${Emojis.General.Error}`,
        ephemeral: true
      });
    }
    switch (tipo) {
      case "text":
        if (await Verification.verifyEnableText(interaction.guild, interaction)) {
          return;
        }
        else {
          const TextUserExists = await Database.usersTextExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                GuildID: interaction.guildId,
                UserID: user.id,
              },
            },
          });
          if (!TextUserExists) {
            return interaction.reply({ content: `El usuario \`${user.username}\` no tiene experiencia registrada. ${Emojis.General.Error}`, ephemeral: true });
          }
          else {
            await interaction.reply({
              content: `<a:loading:1128207815073333341>`,
            });
            let level = TextUserExists.Nivel;
            let experience = TextUserExists.TextExperience;
            let rank = await Database.usersTextExperienceData.findMany({
              where: {
                GuildID: interaction.guildId,
              },
              orderBy: {
                TextExperience: "desc",
              },
            });
            let sorted = rank.sort((a, b) => {
              if (a.Nivel === b.Nivel) {
                return b.TextExperience - a.TextExperience;
              }
              else {
                return b.Nivel - a.Nivel;
              }
            });
            let currentRank = sorted.findIndex((u) => u.UserID === user.id) + 1;
            const requiredXP = (XPCalculator)(level);
            const formattedRequiredXP = formatNumber(requiredXP);
            const formattedRank = formatNumber(currentRank);
            const formattedXP = formatNumber(experience);
            const formattedLevel = formatNumber(level);
            const canvas = (createCanvas)(1000, 300);
            const ctx = canvas.getContext('2d'), bar_width = 600, bg = await (loadImage)('./dist/assets/img/White_Solid_Card.png'), avatar = await (loadImage)(user.displayAvatarURL({ extension: 'png', size: 512 }));
            const circleX = 120 + canvas.width * 0.03; // Ajuste del círculo en el eje X
            const avatarX = circleX - 110;
            const circleY = 170 - (canvas.height * 0.06); // Ajuste del círculo en el eje Y
            const avatarY = circleY - 110;
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(circleX, circleY, 110, 0, 2 * Math.PI); // Ajuste la coordenada X del círculo
            ctx.fill();
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#BEBEBE';
            ctx.stroke();
            ctx.closePath();
            // progress bar
            const gradient = ctx.createLinearGradient(300, 0, 900, 0);
            gradient.addColorStop(0, '#12D6DF');
            gradient.addColorStop(1, '#F70FFF');
            ctx.lineJoin = 'round';
            ctx.lineWidth = 25;
            // empty bar
            ctx.strokeStyle = '#BEBEBE';
            ctx.strokeRect(300, 200, bar_width, 0);
            // filled bar
            ctx.strokeStyle = gradient;
            ctx.strokeRect(300, 200, (bar_width * (experience / requiredXP)), 0);
            // adding text
            ctx.font = '50px Bahnschrift';
            ctx.fillStyle = '#A8A8A8';
            ctx.textAlign = 'center';
            ctx.fillText(`${formattedRank}`, 645, 70, 80);
            ctx.fillText(`${formattedLevel}`, 920, 70, 80);
            ctx.font = '50px Poppins SemiBold';
            ctx.fillText('RANK', 520, 70, 200);
            ctx.fillText('LEVEL', 800, 70, 200);
            ctx.fillStyle = '#3D3D3D';
            ctx.font = '30px Poppins SemiBold';
            ctx.fillText(`${user.username}`, 420, 170), 50;
            ctx.font = '25px Poppins SemiBold';
            ctx.fillText(`${formattedXP} / ${formattedRequiredXP}`, 800, 170);
            ctx.beginPath();
            ctx.arc(circleX, circleY, 110, 0, 2 * Math.PI); // Ajuste el radio del círculo
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, avatarX, avatarY, 220, 220); // Ajusta la coordenada Y y el tamaño del avatar
            const data = canvas.toBuffer('image/png');
            const Attachment = new AttachmentBuilder(data);
            return interaction.editReply({
              files: [Attachment],
              content: ''
            });
          }
        }
      case "voice":
        if (await Verification.verifyEnableVoice(interaction.guild, interaction)) {
          return;
        }
        else {
          const VoiceuserExists = await Database.usersVoiceExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                GuildID: interaction.guildId,
                UserID: user.id,
              },
            },
          });
          if (!VoiceuserExists) {
            return interaction.reply({ content: `El usuario \`${user.username}\` no tiene experiencia registrada. ${Emojis.General.Error}`, ephemeral: true });
          }
          else {
            await interaction.reply({
              content: `<a:loading:1128207815073333341>`,
            });
            let level = VoiceuserExists.Nivel;
            let experience = VoiceuserExists.VoiceExperience;
            let rank = await Database.usersVoiceExperienceData.findMany({
              where: {
                GuildID: interaction.guildId,
              },
              orderBy: {
                TotalExperience: "desc",
              },
            });
            let sorted = rank.sort((a, b) => {
              if (a.Nivel === b.Nivel) {
                return b.TotalExperience - a.TotalExperience;
              }
              else {
                return b.Nivel - a.Nivel;
              }
            });
            let currentRank = sorted.findIndex((u) => u.UserID === user.id) + 1;
            const requiredXP = (XPCalculator)(level);
            const formattedRequiredXP = formatNumber(requiredXP);
            const formattedRank = formatNumber(currentRank);
            const formattedXP = formatNumber(experience);
            const formattedLevel = formatNumber(level);
            const canvas = (createCanvas)(1000, 300);
            const ctx = canvas.getContext('2d'), bar_width = 600, bg = await (loadImage)('./dist/assets/img/White_Solid_Card.png'), avatar = await (loadImage)(user.displayAvatarURL({ extension: 'png', size: 512 }));
            const circleX = 120 + canvas.width * 0.03; // Ajuste del círculo en el eje X
            const avatarX = circleX - 110;
            const circleY = 170 - (canvas.height * 0.06); // Ajuste del círculo en el eje Y
            const avatarY = circleY - 110;
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(circleX, circleY, 110, 0, 2 * Math.PI); // Ajuste la coordenada X del círculo
            ctx.fill();
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#BEBEBE';
            ctx.stroke();
            ctx.closePath();
            // progress bar
            const gradient = ctx.createLinearGradient(300, 0, 900, 0);
            gradient.addColorStop(0, '#12D6DF');
            gradient.addColorStop(1, '#F70FFF');
            ctx.lineJoin = 'round';
            ctx.lineWidth = 25;
            // empty bar
            ctx.strokeStyle = '#BEBEBE';
            ctx.strokeRect(300, 200, bar_width, 0);
            // filled bar
            ctx.strokeStyle = gradient;
            ctx.strokeRect(300, 200, (bar_width * (experience / requiredXP)), 0);
            // adding text
            ctx.font = '50px Poppins Bold';
            ctx.fillStyle = '#A8A8A8';
            ctx.textAlign = 'center';
            ctx.fillText(`${formattedRank}`, 655, 70, 80);
            ctx.fillText(`${formattedLevel}`, 920, 70, 80);
            ctx.font = '50px Poppins SemiBold';
            ctx.fillText('RANK', 540, 70, 200);
            ctx.fillText('LEVEL', 800, 70, 200);
            ctx.fillStyle = '#3D3D3D';
            ctx.font = '30px Poppins SemiBold';
            ctx.fillText(`${user.username}`, 420, 170), 50;
            ctx.font = '25px Poppins SemiBold';
            ctx.fillText(`${formattedXP} / ${formattedRequiredXP}`, 800, 170);
            ctx.beginPath();
            ctx.arc(circleX, circleY, 110, 0, 2 * Math.PI); // Ajuste el radio del círculo
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, avatarX, avatarY, 220, 220); // Ajusta la coordenada Y y el tamaño del avatar
            const data = canvas.toBuffer('image/png');
            const Attachment = new AttachmentBuilder(data);
            return interaction.editReply({
              files: [Attachment],
              content: ''
            });
          }
        }
      default:
        break;
    }
  }
}