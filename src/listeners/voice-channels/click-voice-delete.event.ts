import { Listener, Events } from "@sapphire/framework";
import { VoiceChannel } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import { OnClickVoiceDeleteChannelHelper } from "../../lib/helpers/voice/onClickDeleteChannel";

@ApplyOptions<Listener.Options>({ once: false, event: Events.ChannelDelete })
export class DeleteVoiceListener extends Listener {
    public readonly OnClickVoiceDeleteChannelHelper: OnClickVoiceDeleteChannelHelper;
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
        });

        this.OnClickVoiceDeleteChannelHelper = new OnClickVoiceDeleteChannelHelper();
    }

    public async run(channel: VoiceChannel) {

        try {
            const tempVoice = await this.OnClickVoiceDeleteChannelHelper.findExistingChannel(channel.guild.id, channel);
            if (tempVoice) {
                await this.OnClickVoiceDeleteChannelHelper.deleteChannel(channel, channel.guild.id);
            }

        } catch (error) {
            this.container.console.error(`Error while processing channel deletion: ${error}`);
        }
    }
}

