import { Listener, Events } from "@sapphire/framework";
import { VoiceChannelDeleteHelper } from "@lib/helpers/bot/listeners/voice/channelDelete/channel-delete";
import { ServerLogger } from "@logger";
import { VoiceChannel } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<Listener.Options>({ once: false, event: Events.ChannelDelete })
export class DeleteVoiceListener extends Listener {
    public readonly Logger: ServerLogger;
    public readonly voiceChannelDeleteHelper: VoiceChannelDeleteHelper;
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
        });

        this.Logger = new ServerLogger();
        this.voiceChannelDeleteHelper = new VoiceChannelDeleteHelper();
    }

    public async run(channel: VoiceChannel) {

        try {
            const tempVoice = await this.voiceChannelDeleteHelper.findExistingChannel(channel.guild.id, channel);
            if (tempVoice) {
                await this.voiceChannelDeleteHelper.deleteChannel(channel, channel.guild.id);
            }

        } catch (error) {
            this.Logger.error(`Error while processing channel deletion: ${error.message}`);
        }
    }
}

