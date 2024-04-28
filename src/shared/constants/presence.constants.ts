import { Config } from "@app/config";
import { ActivityType } from "discord.js";

export abstract class Presence {
    public static ActivityType = {
        Playing: ActivityType.Playing,
        Listening: ActivityType.Listening,
        Competing: ActivityType.Competing,
        Streaming: ActivityType.Streaming,
        Watching: ActivityType.Watching,
    };

    public static Activities = Config.app.Activities
}