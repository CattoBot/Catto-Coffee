import { CommandPermissions } from "@shared/enum/commands/permissions.enum";

export class VoiceSubCommands {
    public static Options = {
        name: 'voice',
        requiredClientPermissions: [CommandPermissions.ManageChannels],
        requiredUserPermissions: [CommandPermissions.SendMessages],
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
            {
                name: "trust",
                chatInputRun: "chatInputTrust",
            },
            {
                name: "setup",
                chatInputRun: "chatInputSetup",
            },
        ]
    }
}