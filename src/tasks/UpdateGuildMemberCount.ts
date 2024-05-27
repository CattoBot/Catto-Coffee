import { ScheduledTask } from "@sapphire/plugin-scheduled-tasks";
import { Time } from "@sapphire/time-utilities";
import { ActivityType, PresenceData } from "discord.js";

export class UpdateGUildMemberCountTask extends ScheduledTask {
    constructor(context: ScheduledTask.LoaderContext, options: ScheduledTask.Options) {
        super(context, {
            ...options,
            interval: Time.Hour * 10
        })
    }
    public run() {
        const guildCount = this.container.client.guilds.cache.size;
        const memberCount = this.container.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const presenceData: PresenceData = {
            activities: [
                {
                    name: `${guildCount} Guilds | ${memberCount} Members`,
                    type: ActivityType.Watching,
                }],
            status: 'idle',
        };

        this.container.client.user?.setPresence(presenceData);
    }
}