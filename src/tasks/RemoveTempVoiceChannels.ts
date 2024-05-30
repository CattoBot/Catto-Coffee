import { ApplyOptions } from "@sapphire/decorators";
import { ScheduledTask, ScheduledTaskOptions } from "@sapphire/plugin-scheduled-tasks";
import { Time } from "@sapphire/time-utilities";

@ApplyOptions<ScheduledTaskOptions>({ interval: Time.Day, name: 'RemoveTempVoiceChannelsTask' })
export class RemoveTempVoiceChannelsTask extends ScheduledTask {
    constructor(context: ScheduledTask.LoaderContext, options: ScheduledTask.Options) {
        super(context, {
            ...options,
        });
    }

    public override async run(): Promise<void> {
        const channels = await this.getAllChannels();

        for (const channel of channels) {
            const guild = this.container.client.guilds.cache.get(channel.guildId);
            if (!guild) {
                await this.container.prisma.voice_temp_channels.deleteMany({ where: { guildId: channel.guildId } });
                continue;
            }

            const discordChannel = guild.channels.fetch(channel.channelId);
            if (!discordChannel) {
                await this.container.prisma.voice_temp_channels.delete({ where: { id: channel.id } });
            }
        }
    }

    private async getAllChannels() {
        const channels = await this.container.prisma.voice_temp_channels.findMany();
        return channels;
    }
}
