import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { Time } from "@sapphire/time-utilities";
import { PermissionFlagsBits } from "discord.js";
export class VoiceSubCommands {
    public static Options: SubcommandOptions = {
        name: 'voice',
        requiredClientPermissions: [PermissionFlagsBits.ManageChannels],
        requiredUserPermissions: [PermissionFlagsBits.SendMessages],
        subcommands: [
            {
                name: "showerror",
                messageRun: "messageRunShowError",
                default: true

            },
            {
                name: "name",
                chatInputRun: "chatInputName",
                messageRun: "messageRunName",
                cooldownDelay: Time.Minute * 5,
                cooldownLimit: 2,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "claim",
                chatInputRun: "chatInputClaim",
                messageRun: "messageRunClaim",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelClaimPrecondition']
            },
            {
                name: "ghost",
                chatInputRun: "chatInputGhost",
                messageRun: "messageRunGhost",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "unghost",
                chatInputRun: "chatInputUnghost",
                messageRun: "messageRunUnghost",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "limit",
                chatInputRun: "chatInputLimit",
                messageRun: "messageRunLimit",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "lock",
                chatInputRun: "chatInputLock",
                messageRun: "messageRunLock",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "unlock",
                chatInputRun: "chatInputUnlock",
                messageRun: "messageRunUnlock",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "permit",
                chatInputRun: "chatInputPermit",
                messageRun: "messageRunPermit",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "reject",
                chatInputRun: "chatInputReject",
                messageRun: "messageRunReject",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "transfer",
                chatInputRun: "chatInputTransfer",
                messageRun: "messageRunTransfer",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "invite",
                chatInputRun: "chatInputInvite",
                messageRun: "messageRunInvite",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "bitrate",
                chatInputRun: "chatInputBitrate",
                messageRun: "messageRunBitrate",
                cooldownDelay: Time.Second * 25,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "reset",
                chatInputRun: "chatInputReset",
                messageRun: "messageRunReset",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "trust",
                chatInputRun: "chatInputTrust",
                messageRun: "messageRunTrust",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "untrust",
                chatInputRun: "chatInputUntrust",
                messageRun: "messageRunUntrust",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
            {
                name: "setup",
                chatInputRun: "chatInputSetup",
                messageRun: "messageRunSetup",
                cooldownDelay: Time.Second * 10,
                preconditions: ['ChannelOwnerPrecondition']
            },
        ],
        preconditions: ['GuildBlacklistPrecondition', 'UserBlacklistPrecondition', 'GuildUserBlacklistPrecondition', 'EnabledModulePrecondition', 'EnabledCommandPrecondition', 'RoleCommandPermitPrecondition', 'GuildVoiceOnlyPrecondition', 'EditableChannelPrecondition']
    }
}