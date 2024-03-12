import { SubcommandOptions } from "@sapphire/plugin-subcommands";
import { SubcommandCategories } from "@shared/enum/commands/categories.enum";
import { CommandPermissions } from "@shared/enum/commands/permissions.enum";

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