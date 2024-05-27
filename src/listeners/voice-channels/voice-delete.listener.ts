import { Listener, Events } from "@sapphire/framework";
import { VoiceState, VoiceChannel } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import { VoiceDeleteHelper } from "../../lib/helpers/voice/voiceDelete";

@ApplyOptions<Listener.Options>({ once: false, event: Events.VoiceStateUpdate })
export class VoiceDeleteListener extends Listener {
    public readonly voiceDeleteHelper: VoiceDeleteHelper;
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
        });
        this.voiceDeleteHelper = new VoiceDeleteHelper();
    }

    public async run(oldState: VoiceState, newState: VoiceState) {
        if (this.voiceDeleteHelper.shouldDeleteChannel(oldState, newState)) {
            const { channel } = oldState as { channel: VoiceChannel };
            const existingChannel = await this.voiceDeleteHelper.findExistingChannel(channel.guild.id, channel);
            if (existingChannel) {
                await this.voiceDeleteHelper.deleteChannel(channel);
            }
        }
    }
}
