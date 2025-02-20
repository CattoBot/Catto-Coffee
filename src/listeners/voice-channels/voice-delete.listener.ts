import { Listener, Events } from '@sapphire/framework';
import { VoiceState } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Listener.Options>({ once: false, event: Events.VoiceStateUpdate })
export class VoiceDeleteListener extends Listener {
	constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options
		});
	}

	public async run(oldState: VoiceState, newState: VoiceState) {
		this.container.helpers.voiceChannels.queueChannelDeleteEvent(oldState, newState);
	}
}
