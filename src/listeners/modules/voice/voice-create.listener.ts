import { Listener, Events } from '@sapphire/framework';
import { VoiceState } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { VoiceCreateHelper } from '@lib/helpers/bot/listeners/voice/create';

@ApplyOptions<Listener.Options>({ once: false, event: Events.VoiceStateUpdate })
export class VoiceCreateListener extends Listener {
    private readonly createVoiceHelper: VoiceCreateHelper;

    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
        });
        this.createVoiceHelper = new VoiceCreateHelper();
    }

    public async run(oldState: VoiceState, newState: VoiceState) {
        return this.createVoiceHelper.initChannel(newState, oldState);
    }
}