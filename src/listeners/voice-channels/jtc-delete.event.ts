import { Listener, Events } from "@sapphire/framework";
import { VoiceChannel } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import { onClickDefaultVoiceChannelDelete } from "../../lib/helpers/voice/voiceOnClickDelete";

@ApplyOptions<Listener.Options>({ once: false, event: Events.ChannelDelete })
export class DeleteJTCListener extends Listener {
    public readonly onClickDefaultVoiceChannelDelete: onClickDefaultVoiceChannelDelete;
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
        });
        this.onClickDefaultVoiceChannelDelete = new onClickDefaultVoiceChannelDelete();
    }

    public async run(channel: VoiceChannel) {

        try {
            const tempVoice = await this.onClickDefaultVoiceChannelDelete.findExistingChannel(channel.guild.id, channel);
            if (tempVoice) {
                await this.onClickDefaultVoiceChannelDelete.deleteChannel(channel, channel.guild.id);
            }

        } catch (error) {
            this.container.console.error(`Error while processing channel deletion: ${error}`);
        }
    }
}

