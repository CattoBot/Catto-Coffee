import { ActivityType } from "discord.js";
import { Presence } from "@shared/constants/utils/presence.constants";
import { Client } from "@core/client.core";
import { Config } from "@core/config";

export class PresenceHelper extends Presence {
    private static getRandomActivity(): { name: string; type: ActivityType } {
        const randomActivityType = Object.values(this.ActivityType)[Math.floor(Math.random() * Object.values(this.ActivityType).length)];
        const randomActivity = Object.values(this.Activities)[Math.floor(Math.random() * Object.values(this.Activities).length)];

        return {
            name: randomActivity,
            type: randomActivityType,
        };
    }

    public static async setPresence(client: Client) {
        setInterval(() => {
            const { name, type } = this.getRandomActivity();
            client.user?.setPresence({
                status: Config.Status,
                activities: [{ name, type }],
            });
        }, 10000);
    }
}
