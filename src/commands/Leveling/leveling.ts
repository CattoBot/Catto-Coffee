import { Subcommand } from "@sapphire/plugin-subcommands";
import { Time } from "@sapphire/time-utilities";
import { ChatInputCommand } from "@sapphire/framework";
import { AttachmentBuilder, Guild } from "discord.js";
import Canvacord from "canvacord";
import { Prisma } from "../../client/PrismaClient";
import config from "../../config";
import calculateLevelXP from "../../utils/functions/General/calculateLevelXP";
import Client from "../..";

export class LevelingSubcommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      preconditions: ["GuildOnly"],
      fullCategory: ["Leveling"],
      name: "xp",
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

  private async verifyEnableVoice(Enabled: Guild, Interaction: Subcommand.ChatInputCommandInteraction){
    const guild = await Prisma.guildsData.findUnique({
      where: {
        GuildID: Enabled.id,
      },
    });

    if(guild?.VoiceExpEnabled === false){
      if(Interaction.deferred){
        return Interaction.editReply({
          content: `La experiencia de voz está desactivada en este servidor. ❌`,
        });
      } else {
        return Interaction.reply({
          content: `La experiencia de voz está desactivada en este servidor. ${config.emojis.error}`,
          ephemeral: true,
        });
      }
    }
  }

  private async verifyEnableText(Enabled: Guild, Interaction: Subcommand.ChatInputCommandInteraction){
    const guild = await Prisma.guildsData.findUnique({
      where: {
        GuildID: Enabled.id,
      },
    });

    if(guild?.TextExpEnabled === false){
      if(Interaction.deferred){
        return Interaction.editReply({
          content: `La experiencia por texto está desactivada en este servidor. ❌`,
        });
      }else {
        return Interaction.reply({
          content: `La experiencia por texto está desactivada en este servidor. ${config.emojis.error}`,
          ephemeral: true,
        });
      }
    }
  }
  
  public async chatInputSetLevelXP(interaction: Subcommand.ChatInputCommandInteraction) {
    if(!interaction.memberPermissions?.has('ManageRoles')){
      return interaction.reply({
        content: `No tienes permisos para usar este comando. ${config.emojis.error} permiso requerido: \`Manage Roles\``,
        ephemeral: true,
      });
    }

    const tipo = interaction.options.getString("tipo");
    const user = interaction.options.getUser("user");
    const nivel = interaction.options.getInteger("level");

    const nivelValue = (nivel as number) ?? 0;

    if (nivelValue > 100) {
      return interaction.reply({
        content: `El nivel no puede ser mayor a 100. ${config.emojis.error}`,
        ephemeral: true,
      });
    }
    
    if (nivelValue < 0) {
      return interaction.reply({
        content: `El nivel no puede ser menor a 0.  ${config.emojis.error}`,
        ephemeral: true,
      });
    }

    let TotalGeneralExperience = 0;
    for (let i = 0; i < nivelValue; i++) {
      TotalGeneralExperience += calculateLevelXP(i);
    }

    switch (tipo) {
      case "text":
        if(await this.verifyEnableText(interaction.guild as Guild, interaction)){
          return;
        }else {
          const textUser = await Prisma.usersTextExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                UserID: user?.id as string,
                GuildID: interaction.guildId as string,
              },
            },
          });
  
          if (!textUser) {
            await Prisma.usersTextExperienceData.create({
              data: {
                UserID: user?.id as string,
                GuildID: interaction.guildId as string,
                TotalExperience: Math.round(TotalGeneralExperience),
                Nivel: nivelValue,
              },
            });
          } else {
              await Prisma.usersTextExperienceData.update({
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

          const roles = await Prisma.textRoleRewards.findMany({
            where: {
              GuildID: interaction.guildId as string,
            }
          })

          if(roles.length === 0){
            return interaction.reply(
              `Se ha establecido el nivel de \`${user?.username}\` a \`${nivelValue}\` en canales de texto ${config.emojis.success}`
            );
          } else {
            let roleNames = [];
            for (let i = 0; i < roles.length; i++) {
              const RoleID = roles[i].RoleID;
              const Role = interaction.guild?.roles.cache.get(RoleID);
              if (Role) {
                await interaction.guild?.members.cache.get(user?.id as string)?.roles.add(Role);
                roleNames.push(Role.name);
              }
            }
        
            const roleNamesString = roleNames.join(', ');
            return interaction.reply({
              content: `Se ha establecido el nivel de \`${user?.username}\` a \`${nivelValue}\` en canales de texto ${config.emojis.success} y se han agregado los roles correspondientes. (\`${roleNamesString}\`)`,
            });
          }
        }


      case "voice":
        if(await this.verifyEnableVoice(interaction.guild!, interaction)){
          return;
        } else {
          const VoiceUser = await Prisma.usersVoiceExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                UserID: user?.id as string,
                GuildID: interaction.guildId as string,
              },
            },
          });
  
          if (!VoiceUser) {
            await Prisma.usersVoiceExperienceData.create({
              data: {
                UserID: user?.id as string,
                GuildID: interaction.guildId as string,
                TotalExperience: Math.round(TotalGeneralExperience),
                Nivel: nivelValue,
              },
            });
          } else {
            await Prisma.usersVoiceExperienceData.update({
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
          const roles = await Prisma.voiceRoleRewards.findMany({
            where: {
              GuildID: interaction.guildId as string,
            }
          })

          if(roles.length === 0){
            return interaction.reply(
              `Se ha establecido el nivel de \`${user?.username}\` a \`${nivelValue}\` en canales de voz ${config.emojis.success}`
            );
          } else {
            let roleNames = [];
            for (let i = 0; i < roles.length; i++) {
              const RoleID = roles[i].RoleID;
              const Role = interaction.guild?.roles.cache.get(RoleID);
              if (Role) {
                await interaction.guild?.members.cache.get(user?.id as string)?.roles.add(Role);
                roleNames.push(Role.name);
              }
            }
        
            const roleNamesString = roleNames.join(', ');
            return interaction.reply({
              content: `Se ha establecido el nivel de \`${user?.username}\` a \`${nivelValue}\` en canales de voz ${config.emojis.success} y se han agregado los roles correspondientes. (\`${roleNamesString}\`)`,
            });
          }
        }
        
      default:
        break;
    }
  }

  public async chatInputRewards(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const tipo = interaction.options.getString("tipo") ?? "text";
    switch (tipo) {
      case "text":
        if(await this.verifyEnableText(interaction.guild as Guild, interaction)){
          return;
        } else {
          const TextRewards = await Prisma.textRoleRewards.findMany({
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
  
            return Client.InteractionEmbed(interaction, `\n\n${text.join("\n")}`);
          }
        }
        
      case "voice":
        if(await this.verifyEnableVoice(interaction.guild!, interaction)){
          return;
        } else{
          const VoiceRewards = await Prisma.voiceRoleRewards.findMany({
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
  
            return Client.InteractionEmbed(interaction, `\n\n${text.join("\n")}`);
          }
        }

      default:
        break;
    }
  }

  public async chatInputLadderboard(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    await interaction.deferReply();
    const tipo = interaction.options.getString("tipo") ?? "text";
    switch (tipo) {
      case "text":
        if(await this.verifyEnableText(interaction.guild as Guild, interaction)){
          return;
        } else {
          const TextLadderboard = await Prisma.usersTextExperienceData.findMany({
            where: {
              GuildID: interaction.guildId as string,
            },
            take: 300
          });
  
          if (TextLadderboard.length === 0) {
            return interaction.editReply({
              content: `Parece que en este servidor no hay usuarios con experiencia registrada en \`Canales de Texto\`.`,
            });
          } else {
            let rank = await Prisma.usersTextExperienceData.findMany({
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
  
            let ladderboard = sorted.slice(0, 10);
  
            let text = ladderboard.map((u, i) => {
              return `\`${i + 1}\`. <@${u.UserID}>\nNivel: \`${
                u.Nivel
              }\` ➜ XP:\`${u.TextExperience}\``;
            });
  
            return Client.InteractionEmbed(interaction, `\n\n${text.join("\n")}`);
          }
        }
        
      case "voice":
        if(await this.verifyEnableVoice(interaction.guild!, interaction)){
          return;
        } else {
          const VoiceLadderboard = await Prisma.usersVoiceExperienceData.findMany(
            {
              where: {
                GuildID: interaction.guildId as string,
              },
              take: 300
            }
          );
  
          if (VoiceLadderboard.length === 0) {
            return interaction.editReply({
              content: `Parece que en este servidor no hay usuarios con experiencia registrada en \`Canales de Voz\`.`,
            });
          } else {
            let rank = await Prisma.usersVoiceExperienceData.findMany({
              where: {
                GuildID: interaction.guildId as string,
              },
              orderBy: {
                VoiceExperience: "desc",
              }
            });
  
            let voiceSorted = rank.sort((a, b) => {
              if (a.Nivel === b.Nivel) {
                return b.VoiceExperience - a.VoiceExperience;
              } else {
                return b.Nivel - a.Nivel;
              }
            });
  
            let voiceladderboard = voiceSorted.slice(0, 10);
  
            let voice = voiceladderboard.map((u, i) => {
              return `\`${i + 1}\`. <@${u.UserID}>\nNivel: \`${
                u.Nivel
              }\` ➜ XP:\`${u.VoiceExperience}\``;
            });
  
            return Client.InteractionEmbed(interaction, `${voice.join("\n\n")}`);
          }
        }

      default:
        break;
    }
  }

  public async chatInputRank(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    await interaction.deferReply();
    const tipo = interaction.options.getString("tipo") ?? "text";
    const user = interaction.options.getUser("user") ?? interaction.user;

    if(user.bot){
      return interaction.editReply({
        content: `Los bots no pueden recibir experiencia ❌`,
      });
    }
    switch (tipo) {
      case "text":
        if(await this.verifyEnableText(interaction.guild as Guild, interaction)){
          return;
        } else {
          const TextUserExists = await Prisma.usersTextExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                GuildID: interaction.guildId as string,
                UserID: user.id,
              },
            },
          });
  
          if (!TextUserExists) {
            return interaction.editReply({
              content: user
                ? `El usuario \`${user.username}\` no tiene experiencia registrada.`
                : `No tienes experiencia registrada ${config.emojis.error}, sigue hablando para ganar experiencia`,
            });
          } else {
            let level = TextUserExists.Nivel;
            let experience = TextUserExists.TextExperience;
  
            let rank = await Prisma.usersTextExperienceData.findMany({
              where: {
                GuildID: interaction.guildId as string,
              },
              orderBy: {
                TextExperience: "desc",
              },
            });
  
            let sorted = rank.sort((a, b) => {
              if (a.Nivel === b.Nivel) {
                return b.TextExperience - a.TextExperience;
              } else {
                return b.Nivel - a.Nivel;
              }
            });
  
            let currentRank = sorted.findIndex((u) => u.UserID === user.id) + 1;
  
            const image = new Canvacord.Rank()
              .setAvatar(user.displayAvatarURL({ extension: "png", size: 512 }))
              .setCurrentXP(experience)
              .setRank(currentRank)
              .setLevel(level)
              .setRequiredXP(calculateLevelXP(level))
              .setStatus("dnd")
              .setProgressBar("#FFFFFF", "COLOR")
              .setUsername(user.username)
  
            const data = await image.build();
            const attachment = new AttachmentBuilder(data);
  
            return interaction.editReply({
              files: [attachment],
            });
          }
        }

      case "voice":
        if(await this.verifyEnableVoice(interaction.guild!, interaction)){
          return;
        } else {
          const VoiceuserExists =
          await Prisma.usersVoiceExperienceData.findUnique({
            where: {
              UserID_GuildID: {
                GuildID: interaction.guildId as string,
                UserID: user.id,
              },
            },
          });

        if (!VoiceuserExists) {
          return interaction.editReply({
            content: user
              ? `No se ha encontrado experiencia registrada para \`${user.username}\`.`
              : `No tienes experiencia registrada ${config.emojis.error}, sigue hablando para ganar experiencia`,
          });
        } else {
          let level = VoiceuserExists.Nivel;
          let experience = VoiceuserExists.VoiceExperience;

          let rank = await Prisma.usersVoiceExperienceData.findMany({
            where: {
              GuildID: interaction.guildId as string,
            },
            orderBy: {
              TotalExperience: "desc",
            },
          });

          let sorted = rank.sort((a, b) => {
            if (a.Nivel === b.Nivel) {
              return b.TotalExperience - a.TotalExperience;
            } else {
              return b.Nivel - a.Nivel;
            }
          });

          let currentRank = sorted.findIndex((u) => u.UserID === user.id) + 1;

          let image = new Canvacord.Rank()
            .setAvatar(user.displayAvatarURL({ extension: "png", size: 512 }))
            .setCurrentXP(experience)
            .setRank(currentRank)
            .setLevel(level)
            .setRequiredXP(calculateLevelXP(level))
            .setStatus("dnd")
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(user.username)

          const data = await image.build();
          const attachment = new AttachmentBuilder(data);

          return interaction.editReply({
            files: [attachment],
          });
        } 
        }
      default:
        break;
    }
  }
}