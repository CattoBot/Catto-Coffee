import { Listener, Events } from "@sapphire/framework";
import { OnClickVoiceDeleteChannelHelper } from "@lib/helpers/bot/listeners/voice/channel-delete";
import { logger, ServerLogger } from "@logger";
import { VoiceChannel } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import { onClickDefaultVoiceChannelDelete } from "@lib/helpers/bot/listeners/voice/jtc-delete";

@ApplyOptions<Listener.Options>({ once: false, event: Events.ChannelDelete })
export class DeleteJTCListener extends Listener {
    public readonly Logger: ServerLogger;
    public readonly onClickDefaultVoiceChannelDelete: onClickDefaultVoiceChannelDelete;
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
        });

        this.Logger = logger;
        this.onClickDefaultVoiceChannelDelete = new onClickDefaultVoiceChannelDelete();
    }

    public async run(channel: VoiceChannel) {

        try {
            const tempVoice = await this.onClickDefaultVoiceChannelDelete.findExistingChannel(channel.guild.id, channel);
            if (tempVoice) {
                await this.onClickDefaultVoiceChannelDelete.deleteChannel(channel, channel.guild.id);
            }

        } catch (error) {
            this.Logger.error(`Error while processing channel deletion: ${error.message}`);
        }
    }
}

