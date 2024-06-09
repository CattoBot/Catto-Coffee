import { Subcommand } from "@sapphire/plugin-subcommands";
import { Time } from "@sapphire/time-utilities";

export class SetCommandOptions {
    public static Options: Subcommand.Options = {
        name: "set",
        description: "Genearl user settings.",
        subcommands: [
            {
                name: "profile",
                type: "group",
                entries: [
                    {
                        name: "bio", chatInputRun: "chatInputBioName"
                    },
                ]
            },
            {
                name: "level",
                type: "group",
                entries: [
                    {
                        name: "text", chatInputRun: "chatInputLevelSetText", cooldownDelay: Time.Minute, requiredClientPermissions: ["ManageRoles"], requiredUserPermissions: ["ManageRoles"]
                    },
                    {
                        name: "voice", chatInputRun: "chatInputLevelSetVoice", cooldownDelay: Time.Minute, requiredClientPermissions: ["ManageRoles"], requiredUserPermissions: ["ManageRoles"]
                    }
                ]
            }
        ]
    }
}