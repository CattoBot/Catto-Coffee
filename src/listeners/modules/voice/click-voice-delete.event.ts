import { Listener, Events } from "@sapphire/framework";
import { OnClickVoiceDeleteChannelHelper } from "@lib/helpers/bot/listeners/voice/channel-delete";
import { logger, ServerLogger } from "@logger";
import { VoiceChannel } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<Listener.Options>({ once: false, event: Events.ChannelDelete })
export class DeleteVoiceListener extends Listener {
    public readonly Logger: ServerLogger;
    public readonly OnClickVoiceDeleteChannelHelper: OnClickVoiceDeleteChannelHelper;
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
        });

        this.Logger = logger;
        this.OnClickVoiceDeleteChannelHelper = new OnClickVoiceDeleteChannelHelper();
    }

    public async run(channel: VoiceChannel) {

        try {
            const tempVoice = await this.OnClickVoiceDeleteChannelHelper.findExistingChannel(channel.guild.id, channel);
            if (tempVoice) {
                await this.OnClickVoiceDeleteChannelHelper.deleteChannel(channel, channel.guild.id);
            }

        } catch (error) {
            this.Logger.error(`Error while processing channel deletion: ${error.message}`);
        }
    }
}

