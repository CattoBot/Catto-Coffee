import { ActivityType } from "discord.js";
import { Presence } from "../../shared/constants/utils/utils.constants";
import { CattoClient } from "../../core/client.main";

export class PresenceHelper extends Presence {
    private static getRandomActivity(): { name: string; type: ActivityType } {
        const randomActivityType = Object.values(this.ActivityType)[Math.floor(Math.random() * Object.values(this.ActivityType).length)];
        const randomActivity = Object.values(this.Activities)[Math.floor(Math.random() * Object.values(this.Activities).length)];

        return {
            name: randomActivity,
            type: randomActivityType,
        };
    }

    public static async setRandomActivity(client: CattoClient) {
        setInterval(() => {
            const { name, type } = this.getRandomActivity();
            client.user?.setPresence({
                status: "dnd",
                activities: [{ name, type }],
            });
        }, 10000);
    }
}
