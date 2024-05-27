import { Subcommand } from "@sapphire/plugin-subcommands";
import { Time } from "@sapphire/time-utilities";

export class ProfileCommandOptions {
    public static Options: Subcommand.Options = {
        name: "set",
        description: "Set your profile information.",
        subcommands: [
            {
                name: "bio", chatInputRun: "chatInputBioName", cooldownDelay: Time.Minute
            }
        ]
    }
}