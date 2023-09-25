import { Subcommand } from "@sapphire/plugin-subcommands";
import { ChatInputCommand } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { Database } from "../../structures/Database";
import { Utils } from "../../util/utils";
import { ActionRowBuilder, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from "discord.js";

export class TempVoiceCommands extends Subcommand {
    public constructor(context: Subcommand.Context, options: Subcommand.Options) {
        super(context, {
            ...options,
            cooldownDelay: Time.Second * 8,
            requiredClientPermissions: ["ManageChannels"],
            requiredUserPermissions: ["SendMessages"],
            preconditions: ["VoiceMaster"],
            name: "voice",
            description: "Comandos de voz temporales",
            subcommands: [
                {
                    name: "name",
                    chatInputRun: "chatInputChangeName",
                },
                {
                    name: "claim",
                    chatInputRun: "chatInputClaim",
                },
                {
                    name: "ghost",
                    chatInputRun: "chatInputGhost",
                },
                {
                    name: "unghost",
                    chatInputRun: "chatInputUnghost",
                },
                {
                    name: "limit",
                    chatInputRun: "chatInputLimit",
                },
                {
                    name: "lock",
                    chatInputRun: "chatInputLock",
                },
                {
                    name: "unlock",
                    chatInputRun: "chatInputUnlock",
                },
                {
                    name: "permit",
                    chatInputRun: "chatInputPermit",
                },
                {
                    name: "reject",
                    chatInputRun: "chatInputReject",
                },
                {
                    name: "transfer",
                    chatInputRun: "chatInputTransfer",
                },
                {
                    name: "invite",
                    chatInputRun: "chatInputInvite",
                },
                {
                    name: "bitrate",
                    chatInputRun: "chatInputBitrate",
                },
                {
                    name: "reset",
                    chatInputRun: "chatInputReset",
                },
            ],
        });
    }

    registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName("voice")
                    .setDescription("Comandos de voz temporales")
                    .addSubcommand((Command) =>
                        Command.setName("claim").setDescription(
                            "Reclama un canal de voz temporal libre."
                        )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("name").setDescription(
                            "Cambia el nombre de tu canal de voz."
                        )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("ghost").setDescription(
                            "Oculta tu canal de voz temporal."
                        )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("unghost").setDescription(
                            "Habilita la visibilidad de tu canal de voz."
                        )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("limit")
                            .setDescription(
                                "Limita el numero de usuarios en tu canal de voz."
                            )
                            .addIntegerOption((option) =>
                                option
                                    .setName("limite")
                                    .setDescription("El limite de usuarios en tu canal de voz.")
                                    .setRequired(true)
                            )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("lock").setDescription("Bloquea tu canal de voz.")
                    )
                    .addSubcommand((Command) =>
                        Command.setName("unlock").setDescription(
                            "Desbloquea tu canal de voz."
                        )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("permit")
                            .setDescription("Permite a un usuario unirse a tu canal de voz.")
                            .addUserOption((option) =>
                                option
                                    .setName("usuario")
                                    .setDescription(
                                        "El usuario al que quieres permitir unirse a tu canal de voz."
                                    )
                                    .setRequired(true)
                            )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("reject")
                            .setDescription(
                                "Rechaza a un usuario de unirse a tu canal de voz."
                            )
                            .addUserOption((option) =>
                                option
                                    .setName("usuario")
                                    .setDescription(
                                        "El usuario al que quieres rechazar de unirse a tu canal de voz."
                                    )
                                    .setRequired(true)
                            )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("transfer")
                            .setDescription(
                                "Transfiere la propiedad de tu canal de voz a otro usuario."
                            )
                            .addUserOption((option) =>
                                option
                                    .setName("usuario")
                                    .setDescription(
                                        "El usuario al que quieres transferir la propiedad de tu canal de voz."
                                    )
                                    .setRequired(true)
                            )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("invite")
                            .setDescription("Invita a un usuario a tu canal de voz.")
                            .addUserOption((option) =>
                                option
                                    .setName("usuario")
                                    .setDescription(
                                        "El usuario al que quieres invitar a tu canal de voz."
                                    )
                                    .setRequired(true)
                            )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("bitrate")
                            .setDescription("Cambia el bitrate de tu canal de voz.")
                            .addIntegerOption((option) =>
                                option
                                    .setName("bitrate")
                                    .setDescription(
                                        "El bitrate que quieres poner en tu canal de voz."
                                    )
                                    .setRequired(true)
                            )
                    )
                    .addSubcommand((Command) =>
                        Command.setName("reset").setDescription(
                            "Resetea todos los permisos de tu canal de voz."
                        )
                    ),
            {
                idHints: [""],
            }
        );
    }

    public async chatInputClaim(interaction: Subcommand.ChatInputCommandInteraction) {
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mi.`,
                ephemeral: true,
            });
        } else {
            if (getChannel.ChannelOwner === UserID) {
                return interaction.reply({
                    content: `${Utils.getEmojis().General.Warning} Ya eres el owner de este canal.`,
                    ephemeral: true,
                });
            }
            if (VoiceChannel.members.has(getChannel.ChannelOwner)) {
                return interaction.reply({
                    content: `${Utils.getEmojis().General.Error} El owner de este canal se encuentra en el canal de voz.`,
                    ephemeral: true,
                });
            } else {
                await Database.activeTempVoices.update({
                    where: {
                        GuildID_ChannelID: {
                            GuildID: interaction.guild?.id || "",
                            ChannelID: VoiceChannel.id || "",
                        },
                    },
                    data: {
                        ChannelOwner: UserID,
                    },
                });

                return interaction.reply({
                    content: `${Utils.getEmojis().General.Success} Has reclamado con éxito el canal de voz.`,
                });
            }
        }
    }

    public async chatInputGhost(interaction: Subcommand.ChatInputCommandInteraction) {
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mi.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el owner de este canal de voz.`,
                ephemeral: true,
            });
        } else {
            const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
            const UserPermissions = ChannelPermissions.get(
                VoiceChannel.guild.roles.everyone.id
            );

            if (UserPermissions) {
                await VoiceChannel.permissionOverwrites.edit(
                    VoiceChannel.guild.roles.everyone.id,
                    {
                        ...UserPermissions,
                        ViewChannel: false,
                    }
                );
            } else {
                await VoiceChannel.permissionOverwrites.edit(
                    VoiceChannel.guild.roles.everyone.id,
                    {
                        ViewChannel: false,
                    }
                );
            }
            return interaction.reply({
                content: `${Utils.getEmojis().General.Success} Se ha ocultado el canal de voz éxitosamente.`,
            });
        }
    }

    public async chatInputUnghost(interaction: Subcommand.ChatInputCommandInteraction) {
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mi.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el owner de este canal de voz.`,
                ephemeral: true,
            });
        } else {
            const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
            const UserPermissions = ChannelPermissions.get(
                VoiceChannel.guild.roles.everyone.id
            );

            if (UserPermissions) {
                await VoiceChannel.permissionOverwrites.edit(
                    VoiceChannel.guild.roles.everyone.id,
                    {
                        ...UserPermissions,
                        ViewChannel: true,
                    }
                );
            } else {
                await VoiceChannel.permissionOverwrites.edit(
                    VoiceChannel.guild.roles.everyone.id,
                    {
                        ViewChannel: true,
                    }
                );
            }
            return interaction.reply({
                content: `${Utils.getEmojis().General.Success} El canal ha vuelto a ser visible éxitosamente.`,
            });
        }
    }

    public async chatInputLimit(interaction: Subcommand.ChatInputCommandInteraction) {
        const VoiceChannelLimit = interaction.options.getInteger("limite") || 0;
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mi.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el owner de este canal de voz.`,
                ephemeral: true,
            });
        } else {
            if (VoiceChannelLimit > 99) {
                return interaction.reply({
                    content: `${Utils.getEmojis().General.Error} El límite de usuarios no puede ser mayor a 99.`,
                    ephemeral: true,
                });
            } else {
                await VoiceChannel.setUserLimit(VoiceChannelLimit);
            }

            return interaction.reply({
                content: `${Utils.getEmojis().General.Success} El límite de usuarios ha sido cambiado a \`${VoiceChannelLimit}\` éxitosamente.`,
            });
        }
    }

    public async chatInputLock(interaction: Subcommand.ChatInputCommandInteraction) {
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mi.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el owner de este canal de voz.`,
                ephemeral: true,
            });
        } else {
            const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
            const UserPermissions = ChannelPermissions.get(
                VoiceChannel.guild.roles.everyone.id
            );

            if (UserPermissions) {
                await VoiceChannel.permissionOverwrites.edit(
                    VoiceChannel.guild.roles.everyone.id,
                    {
                        ...UserPermissions,
                        Connect: false,
                    }
                );
            } else {
                await VoiceChannel.permissionOverwrites.edit(
                    VoiceChannel.guild.roles.everyone.id,
                    {
                        Connect: false,
                    }
                );
            }

            return interaction.reply({
                content: `${Utils.getEmojis().General.Success} El canal ha sido bloqueado éxitosamente.`,
            });
        }
    }

    public async chatInputUnlock(interaction: Subcommand.ChatInputCommandInteraction) {
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mi.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el owner de este canal de voz.`,
                ephemeral: true,
            });
        } else {
            const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
            const UserPermissions = ChannelPermissions.get(
                VoiceChannel.guild.roles.everyone.id
            );

            if (UserPermissions) {
                await VoiceChannel.permissionOverwrites.edit(
                    VoiceChannel.guild.roles.everyone.id,
                    {
                        ...UserPermissions,
                        Connect: true,
                    }
                );
            } else {
                await VoiceChannel.permissionOverwrites.edit(
                    VoiceChannel.guild.roles.everyone.id,
                    {
                        Connect: true,
                    }
                );
            }

            return interaction.reply({
                content: `${Utils.getEmojis().General.Success} El canal ha sido desbloqueado éxitosamente.`,
            });
        }
    }

    public async chatInputPermit(interaction: Subcommand.ChatInputCommandInteraction) {
        const TargetUser = interaction.options.getUser("usuario", true);
        const TargetUserID = TargetUser?.id;
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (TargetUserID === UserID) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Success} No puedes habilitar el acceso al canal a ti mismo.`,
                ephemeral: true,
            });
        }

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mi.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el owner de este canal de voz.`,
                ephemeral: true,
            });
        }

        const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
        const UserPermissions = ChannelPermissions.get(TargetUserID);
        if (UserPermissions) {
            await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
                ...UserPermissions,
                ViewChannel: true,
                Connect: true,
            });
        } else {
            await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
                ViewChannel: true,
                Connect: true,
            });
        }

        return interaction.reply({
            content: `${Utils.getEmojis().General.Success} Se ha permitido el acceso a \`${TargetUser.username}\`.`,
        });
    }

    public async chatInputReject(interaction: Subcommand.ChatInputCommandInteraction) {
        const TargetUser = interaction.options.getUser("usuario", true);
        const TargetUserID = TargetUser?.id;
        const MemberTarget = interaction.guild?.members.cache.get(TargetUserID);
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (TargetUserID === UserID) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Success} No puedes denegarte el acceso al canal a ti mismo.`,
                ephemeral: true,
            });
        }

        if (MemberTarget?.permissions.has("MuteMembers" || "ManageMessages")) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No puedes denegar el acceso a un miembro con permisos de moderación.`,
                ephemeral: true,
            });
        }

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mí.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el propietario de este canal de voz.`,
                ephemeral: true,
            });
        }

        const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
        const UserPermissions = ChannelPermissions.get(TargetUserID);

        if (Member?.voice.channel?.id !== VoiceChannel.id) {
            // El miembro está en otro canal de voz
            if (UserPermissions) {
                await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
                    ...UserPermissions,
                    Connect: false,
                });
            } else {
                await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
                    Connect: false,
                });
            }
        } else {
            // El miembro está en el canal de voz del autor del comando
            if (UserPermissions) {
                await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
                    ...UserPermissions,
                    Connect: false,
                });
            } else {
                await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
                    Connect: false,
                });
            }

            const TargetMember = interaction.guild?.members.cache.get(TargetUserID);
            if (TargetMember?.voice.channel?.id === VoiceChannel.id) {
                await TargetMember.voice.disconnect();
            }
        }

        return interaction.reply({
            content: `${Utils.getEmojis().General.Success} Se ha denegado el acceso a \`${TargetUser.username}\`.`,
        });
    }

    public async chatInputTransfer(interaction: Subcommand.ChatInputCommandInteraction) {
        const TargetUser = interaction.options.getUser("usuario", true);
        const TargetUserID = TargetUser?.id;
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (TargetUserID === UserID) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Warning} No puedes transferirte el owner del canal a ti mismo.`,
                ephemeral: true,
            });
        }

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id || "",
                    ChannelID: VoiceChannel.id || "", // Add a default value of an empty string if VoiceChannel.id is undefined
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mí.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el propietario de este canal de voz.`,
                ephemeral: true,
            });
        } else {
            await Database.activeTempVoices.update({
                where: {
                    GuildID_ChannelID: {
                        GuildID: interaction.guild?.id || "",
                        ChannelID: VoiceChannel.id || "",
                    },
                },
                data: {
                    ChannelOwner: TargetUserID,
                },
            });

            return interaction.reply({
                content: `${Utils.getEmojis().General.Success} Has transferido el owner del canal a \`${TargetUser.username}\`.`,
            });
        }
    }
    public async chatInputInvite(interaction: Subcommand.ChatInputCommandInteraction) {
        const TargetUser = interaction.options.getUser("usuario", true);
        const TargetUserID = TargetUser?.id;
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (TargetUserID === UserID) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Warning} No puedes invitarte al canal a ti mismo.`,
                ephemeral: true,
            });
        }

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id || "",
                    ChannelID: VoiceChannel.id || "", // Add a default value of an empty string if VoiceChannel.id is undefined
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mí.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el propietario de este canal de voz.`,
                ephemeral: true,
            });
        } else {
            const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
            const UserPermissions = ChannelPermissions.get(TargetUserID);

            if (UserPermissions) {
                await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
                    ...UserPermissions,
                    Connect: true,
                });
            }
            await TargetUser.send({
                content: `Has sido invitado al canal de voz \`${VoiceChannel.name}\`(${VoiceChannel.url}) en el servidor \`${interaction.guild?.name}\`.`,
            }).catch(async () => {
                return interaction.reply({
                    content: `${Utils.getEmojis().General.Error} No se le ha podido enviar la invitación a \`${TargetUser.username}\` verifica que tenga sus DM disponibles.`,
                    ephemeral: true,
                })
            });
            await interaction
                .reply({
                    content: `${Utils.getEmojis().General.Success} Se le ha enviado la invitación a \`${TargetUser.username}\` éxitosamente.`,
                })
                .catch(() => { });
        }
    }

    public async chatInputBitrate(interaction: Subcommand.ChatInputCommandInteraction) {
        function ConvertBitrateToMillions(bitrate: number) {
            return bitrate * 1000;
        }
        const Bitrate = interaction.options.getInteger("bitrate", true);
        const BitrateEnMiles = ConvertBitrateToMillions(Bitrate);
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                }
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mí.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el propietario de este canal de voz.`,
                ephemeral: true,
            });
        } else {
            await VoiceChannel.edit({
                bitrate: BitrateEnMiles,
            });

            return interaction.reply({
                content: `${Utils.getEmojis().General.Success} Se ha cambiado el bitrate del canal de voz a \`${Bitrate}\`kbps.`,
            });
        }
    }
    public async chatInputChangeName(interaction: Subcommand.ChatInputCommandInteraction) {


        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mí.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el propietario de este canal de voz.`,
                ephemeral: true,
            });
        } else {
            const Modal = new ModalBuilder()
                .setCustomId("vc-name")
                .setTitle("¿Quieres cambiar el nombre?")
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId("voice-name")
                                .setLabel("Nombre")
                                .setPlaceholder("Nombre que tendrá tu canal de voz.")
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                                .setMinLength(1)
                                .setMaxLength(60)
                        )
                );

            await interaction.showModal(Modal).catch((error) => { console.log(error) });

        }
    }

    public async chatInputReset(interaction: Subcommand.ChatInputCommandInteraction) {
        const UserID = interaction.user.id;
        const Member = interaction.guild?.members.cache.get(UserID);
        const VoiceChannel = Member?.voice.channel;

        if (!VoiceChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Necesitas estar en un canal de voz para usar este comando.`,
                ephemeral: true,
            });
        }

        const getChannel = await Database.activeTempVoices.findUnique({
            where: {
                GuildID_ChannelID: {
                    GuildID: interaction.guild?.id,
                    ChannelID: VoiceChannel.id
                },
            },
        });

        if (!getChannel) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} Este canal de voz no se encuentra disponible. Asegúrate de que ha sido creado por mí.`,
                ephemeral: true,
            });
        }

        if (UserID !== getChannel.ChannelOwner) {
            return interaction.reply({
                content: `${Utils.getEmojis().General.Error} No eres el propietario de este canal de voz.`,
                ephemeral: true,
            });
        } else {
            const categoryChannel = VoiceChannel.parent
            const channelOverwrites = categoryChannel.permissionOverwrites.cache.map((overwrite) => {
                return {
                    id: overwrite.id,
                    allow: overwrite.allow.bitfield,
                    deny: overwrite.deny.bitfield,
                };
            });

            const userPermission = {
                id: UserID,
                allow: PermissionFlagsBits.Connect | PermissionFlagsBits.ViewChannel,
                deny: BigInt(0),
            }

            await VoiceChannel.permissionOverwrites.set(channelOverwrites.concat(userPermission))

            return interaction.reply({
                content: `${Utils.getEmojis().General.Success} Se han reseteado los permisos canal de voz.`,
            });
        }
    }
}