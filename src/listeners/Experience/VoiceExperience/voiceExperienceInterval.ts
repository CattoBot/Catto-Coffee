import { Listener, Events } from "@sapphire/framework";
import { addMembersVoiceExperience } from "../../../utils/functions/Exp System/Voice/addVoiceExp";
import Config from "../../../config";

export class VoiceExperienceIntervalListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.ClientReady
        });
    }

    public async run() {
        setInterval(async () => {
            await addMembersVoiceExperience();
        }, Config.BotSettings.DefaultVoiceExperienceSpeed * 1000);
    }
}