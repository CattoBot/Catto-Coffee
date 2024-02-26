import { Listener, Events } from '@sapphire/framework';
import { VoiceState, CategoryChannel } from 'discord.js';
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
        const channels = await this.createVoiceHelper.getChannel(newState.guild.id);

        await Promise.all(channels.map(async ({ channel_id, parent_id }) => {
            const parent = newState.guild.channels.resolve(parent_id) as CategoryChannel;
            if (this.createVoiceHelper.shouldCreateChannel(oldState, newState, channel_id)) {
                await this.createVoiceHelper.createChannel(newState.guild, parent, newState.member.id, newState);
            }
        }));
    }
}