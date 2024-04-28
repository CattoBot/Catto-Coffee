import { Status } from "@shared/enum/misc/status.enum";

interface AppConfig extends AppCommandOptions {
    /**
     * Bot token
     */
    Token: string;
    /**
     * Bot owners
     */
    Owners: string[];

    /**
     * Guild ID
     */

    Guilds: string[];
    /**
     * Bot Default prefix
     */
    DefaultPrefix: string;
    /**
     * Shards
     */
    Shards: number | "auto" | number[];
    /**
     * Bot Status
     */
    Status: Status;

    Activities: string[];
}

interface AppCommandOptions {
    /**
     * Should the app refresh the current global commands
     * If set to true, then yes, if set to false, no
     */
    refreshCommands: boolean;
}

export type App = AppConfig;