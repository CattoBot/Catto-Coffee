import { ActivityType } from "discord.js";
import { Config } from "@core/config";

export class Messages {
    public static Success = {
        BotReady: (name: string) => `${name} is ready to rumble.`,
        DatabaseSuccess: (ping: string) => `Successfully connected to database with ${ping} .`,
        ClientSuccess: (client: string) => `Successfully connected to Discord Gateway with ${client}.`
    };

    public static Errors = {
        MissingToken: 'Token is not defined in the environment variables.',
        BotClientError: 'Something went wrong fetching the Discord Gateway.',
        DatabaseError: 'Something went wrong fetching the database.',
    };
}

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