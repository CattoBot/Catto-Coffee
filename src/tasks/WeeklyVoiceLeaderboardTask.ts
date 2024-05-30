import { ApplyOptions } from "@sapphire/decorators";
import { ScheduledTask } from "@sapphire/plugin-scheduled-tasks";
import { Time } from "@sapphire/time-utilities";
import { TextChannel, EmbedBuilder } from "discord.js";
import { addDays, formatISO } from "date-fns";
import { toZonedTime, format } from "date-fns-tz";
import { LeaderboardImageBuilder } from "../lib/classes/LeaderboardCard";

@ApplyOptions<ScheduledTask.Options>({ interval: Time.Hour * 3, name: 'WeeklyVoiceTop10Task' })
export class WeeklyVoiceLeaderboardTask extends ScheduledTask {
    public constructor(context: ScheduledTask.LoaderContext, options: ScheduledTask.Options) {
        super(context, {
            ...options,
        });
    }

    public async run(): Promise<void> {
        const weeklyTop = await this.container.prisma.weekly_top.findMany();
        this.container.console.info('Starting to process weekly tops...', weeklyTop);

        for (const top of weeklyTop) {
            const guildId = top.guildId;
            let nextPublishDate = await this.getNextPublishDate(guildId);
            const now = new Date();

            if (now >= nextPublishDate) {
                this.container.console.info(`Processing guild with ID: ${guildId}`);
                const guildTop10 = await this.getTop10VoiceUsers(guildId);
                const channel = await this.getChannelId(guildId);

                if (guildTop10.length && channel) {
                    this.container.console.info('Found top 10 voice users and channel...');
                    const buffer = await this.generateWeeklyVoiceLeaderboard(guildTop10);

                    const textChannel = await this.container.client.channels.fetch(channel) as TextChannel;
                    if (top.lastWeeklyMessageId) {
                        try {
                            const previousMessage = await textChannel.messages.fetch(top.lastWeeklyMessageId);
                            await previousMessage.delete();
                        } catch (error) {
                            this.container.console.error('Error deleting previous message:', error);
                        }
                    }

                    const timeZone = 'America/New_York';
                    const zonedDate = toZonedTime(nextPublishDate, timeZone);
                    const nextResetTime = format(zonedDate, 'HH:mm zzz', { timeZone });

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: 'Weekly Voice Leaderboard', iconURL: 'https://res.cloudinary.com/dp5dbsd8w/image/upload/v1717049320/badges/hveiskr7ec2oxpvfrzko.png' })
                        .setFooter({ text: `Resets every week at: ${nextResetTime}`, iconURL: 'https://res.cloudinary.com/dp5dbsd8w/image/upload/v1717049320/badges/djrnims3eavniivxbqjs.webp' })
                        .setImage('attachment://leaderboard.png');
                    const newMessage = await textChannel.send({ embeds: [embed], files: [{ attachment: buffer, name: 'leaderboard.png' }] });
                    this.container.console.info('Sent new weekly top message.');
                    await this.updateWeeklyTopMessageId(guildId, newMessage.id);
                    await this.deleteWeeklyVoiceExperience(guildId);
                }

                const newNextDate = addDays(now, 7); // 1 week
                await this.updateNextPublishDate(guildId, newNextDate);
            }
        }

        this.container.console.info('Finished run() method.');
    }

    private async getTop10VoiceUsers(guildId: string) {
        this.container.console.info('Fetching top 10 voice users...');
        const top = await this.container.prisma.voice_experience.findMany({
            where: { guildId },
            take: 10,
            orderBy: { weeklyTimeInVoiceChannel: 'desc' }
        });
        this.container.console.info('Fetched top 10 voice users.', top);
        return top;
    }

    private async deleteWeeklyVoiceExperience(guildId: string) {
        await this.container.prisma.voice_experience.updateMany({
            where: { guildId },
            data: { weeklyTimeInVoiceChannel: 0 }
        });
        this.container.console.info('Deleted weekly voice experience.');
    }

    private async getChannelId(guildId: string) {
        const channel = await this.container.prisma.leaderboard_channels.findUnique({
            where: { guildId }
        });
        this.container.console.info('Fetched channel ID:', channel?.weeklyVoiceTop10channelId);
        return channel?.weeklyVoiceTop10channelId;
    }

    private async getNextPublishDate(guildId: string): Promise<Date> {
        let nextDateString = await this.container.redis.get(`weekly:publish:${guildId}`);
        this.container.console.info('Fetched next publish date from Redis:', nextDateString);

        if (!nextDateString) {
            const weeklyTop = await this.container.prisma.weekly_top.findUnique({
                where: { guildId }
            });

            if (!weeklyTop) {
                throw new Error(`WeeklyTop record not found for guildId: ${guildId}`);
            }

            const baseDate = weeklyTop.updatedAt!;
            this.container.console.info(`Fetched base date from database (updatedAt): ${baseDate}`);

            const nextDate = addDays(baseDate, 7);
            this.container.console.info(`Calculated next publish date from base date: ${nextDate}`);

            await this.updateNextPublishDate(guildId, nextDate);

            return nextDate;
        }

        return new Date(nextDateString);
    }

    private async updateNextPublishDate(guildId: string, nextDate: Date): Promise<void> {
        await this.container.redis.set(`weekly:publish:${guildId}`, formatISO(nextDate));
        this.container.console.info('Updated next publish date:', nextDate);
    }

    private async updateWeeklyTopMessageId(guildId: string, messageId: string): Promise<void> {
        await this.container.prisma.weekly_top.update({
            where: { guildId },
            data: { lastWeeklyMessageId: messageId }
        });
        this.container.console.info('Updated weekly top message ID:', messageId);
    }

    private async generateWeeklyVoiceLeaderboard(guildTop10: any[]) {
        const bg = ('../../../assets/img/Catto_VC_Weekly.png');
        const leaderboard = new LeaderboardImageBuilder()
            .setGuildLeaderboard(guildTop10)
            .setBackground(bg)
            .setShowWeeklyTimeInVoiceChannel(true);
        const lb = await leaderboard.build();
        return lb as Buffer;
    }
}
