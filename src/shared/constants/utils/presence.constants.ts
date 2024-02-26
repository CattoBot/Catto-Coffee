import { Config } from "@core/config";
import { ActivityType } from "discord.js";

export class Presence {
    public static ActivityType = {
        Playing: ActivityType.Playing,
        Listening: ActivityType.Listening,
        Competing: ActivityType.Competing,
        Streaming: ActivityType.Streaming,
        Watching: ActivityType.Watching,
    };

    public static Activities = Config.Presence.Activities
}