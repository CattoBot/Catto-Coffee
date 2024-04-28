import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { SubcommandCategories } from "@shared/enum/commands/categories.enum";
import { CommandPermissions } from "@shared/enum/commands/permissions.enum";
import { Time } from "@sapphire/time-utilities";
export class VoiceSubCommands {
    public static Options: SubcommandOptions = {
        name: 'voice',
        requiredClientPermissions: [CommandPermissions.ManageChannels],
        requiredUserPermissions: [CommandPermissions.SendMessages],
        fullCategory: [SubcommandCategories.Voice],
        subcommands: [
            {
                name: "name",
                chatInputRun: "chatInputName",
                cooldownDelay: Time.Minute * 5,
                cooldownLimit: 2,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "claim",
                chatInputRun: "chatInputClaim",
                preconditions: ['ChannelClaimPrecondition']
            },
            {
                name: "ghost",
                chatInputRun: "chatInputGhost",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "unghost",
                chatInputRun: "chatInputUnghost",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "limit",
                chatInputRun: "chatInputLimit",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "lock",
                chatInputRun: "chatInputLock",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "unlock",
                chatInputRun: "chatInputUnlock",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "permit",
                chatInputRun: "chatInputPermit",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "reject",
                chatInputRun: "chatInputReject",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "transfer",
                chatInputRun: "chatInputTransfer",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "invite",
                chatInputRun: "chatInputInvite",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "bitrate",
                chatInputRun: "chatInputBitrate",
                cooldownDelay: Time.Second * 25,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "reset",
                chatInputRun: "chatInputReset",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "trust",
                chatInputRun: "chatInputTrust",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "untrust",
                chatInputRun: "chatInputUntrust",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
            {
                name: "setup",
                chatInputRun: "chatInputSetup",
                cooldownDelay: Time.Second * 10,
                preconditions:['ChannelOwnerPrecondition']
            },
        ],
        preconditions: ['GuildBlacklistPrecondition', 'UserBlacklistPrecondition', 'GuildUserBlacklistPrecondition']
    }
}