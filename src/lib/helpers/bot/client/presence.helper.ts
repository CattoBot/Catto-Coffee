import { ActivityType } from "discord.js";
import { Presence } from "@shared/constants/presence.constants";
import { Client } from "@app/client";
import { Config } from "@app/config";

export class PresenceHelper extends Presence {
    private static get(): { name: string; type: ActivityType } {
        const randomActivityType = Object.values(this.ActivityType)[Math.floor(Math.random() * Object.values(this.ActivityType).length)];
        const randomActivity = Object.values(this.Activities)[Math.floor(Math.random() * Object.values(this.Activities).length)];

        return {
            name: randomActivity,
            type: randomActivityType,
        };
    }

    public static async set(client: Client) {
        setInterval(() => {
            const { name, type } = this.get();
            client.user?.setPresence({
                status: Config.app.Status,
                activities: [{ name, type }],
            });
        }, 10000);
    }
}
