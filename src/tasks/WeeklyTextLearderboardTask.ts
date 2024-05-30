import { ApplyOptions } from "@sapphire/decorators";
import { ScheduledTask, ScheduledTaskOptions } from "@sapphire/plugin-scheduled-tasks";
import { Time } from "@sapphire/time-utilities";
import { Colors, EmbedBuilder, TextChannel } from "discord.js";
import { addDays, formatISO } from "date-fns";
import { toZonedTime, format } from "date-fns-tz";
import { LeaderboardImageBuilder } from "../lib/classes/LeaderboardCard";
import { LeaderboardUserData } from "../shared/interfaces/LeaderboardUser";

@ApplyOptions<ScheduledTaskOptions>({ interval: Time.Hour * 2, name: 'WeeklyTextLeaderboardTask' })
export class WeeklyTextLeaderboardTask extends ScheduledTask {
    public constructor(context: ScheduledTask.LoaderContext, options: ScheduledTask.Options) {
        super(context, {
            ...options,
        });
    }

    public async run(): Promise<void> {
        const dailyTop = await this.container.prisma.daily_top.findMany();
        this.container.console.info('Starting to process weekly text tops...', dailyTop);

        for (const top of dailyTop) {
            const guildId = top.guildId;
            let nextPublishDate = await this.getNextPublishDate(guildId);
            const now = new Date();
            if (now >= nextPublishDate) {
                this.container.console.info(`Processing guild with ID: ${guildId}`);
                const guildTop10 = await this.getTop10TextUsers(guildId);
                const channel = await this.getChannelId(guildId);

                if (guildTop10.length && channel) {
                    this.container.console.info('Found top 10 text users and channel...');
                    const buffer = await this.generateDailyVoiceLeaderboard(guildTop10);

                    const textChannel = await this.container.client.channels.fetch(channel) as TextChannel;
                    if (top.lastDailyMessageId) {
                        try {
                            const previousMessage = await textChannel.messages.fetch(top.lastDailyMessageId);
                            await previousMessage.delete();
                        } catch (error) {
                            this.container.console.error('Error deleting previous message:', error);
                        }
                    }

                    const timeZone = 'America/New_York';
                    const zonedDate = toZonedTime(nextPublishDate, timeZone);
                    const nextResetTime = format(zonedDate, 'HH:mm zzz', { timeZone });

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: 'Weekly Text Leaderboard', iconURL: 'https://res.cloudinary.com/dp5dbsd8w/image/upload/v1717049320/badges/hveiskr7ec2oxpvfrzko.png' })
                        .setFooter({ text: `Resets every week at: ${nextResetTime}`, iconURL: 'https://res.cloudinary.com/dp5dbsd8w/image/upload/v1717049320/badges/djrnims3eavniivxbqjs.webp' })
                        .setImage('attachment://leaderboard.png')
                        .setColor(Colors.White)
                    const newMessage = await textChannel.send({ embeds: [embed], files: [{ attachment: buffer, name: 'leaderboard.png' }] });
                    this.container.console.info('Sent new daily top message.');
                    await this.updatedailyTopMessageId(guildId, newMessage.id);
                    await this.deletedailyVoiceExperience(guildId);
                }

                const newNextDate = addDays(now, 1);
                await this.updateNextPublishDate(guildId, newNextDate);
            }
        }

        this.container.console.info('Finished run() method.');
    }

    private async getTop10TextUsers(guildId: string) {
        this.container.console.info('Fetching top 10 text users...');
        const top = await this.container.prisma.text_experience.findMany({
            where: { guildId },
            take: 10,
            orderBy: { totalMessagesWeekly: 'desc' }
        });
        this.container.console.info('Fetched top 10 text users.', top);
        return top;
    }

    private async deletedailyVoiceExperience(guildId: string) {
        await this.container.prisma.text_experience.updateMany({
            where: { guildId },
            data: { totalMessagesWeekly: 0 }
        });
        this.container.console.info('Deleted daily voice experience.');
    }

    private async getChannelId(guildId: string) {
        const channel = await this.container.prisma.leaderboard_channels.findUnique({
            where: { guildId }
        });
        this.container.console.info('Fetched channel ID:', channel?.weeklyTextTop10channelId);
        return channel?.weeklyTextTop10channelId;
    }

    private async getNextPublishDate(guildId: string): Promise<Date> {
        let nextDateString = await this.container.redis.get(`daily:publish:${guildId}`);
        this.container.console.info('Fetched next publish date from Redis:', nextDateString);

        if (!nextDateString) {
            const dailyTop = await this.container.prisma.daily_top.findUnique({
                where: { guildId }
            });

            if (!dailyTop) {
                throw new Error(`dailyTop record not found for guildId: ${guildId}`);
            }

            const baseDate = dailyTop.updated_at!;
            this.container.console.info(`Fetched base date from database (updatedAt): ${baseDate}`);

            const nextDate = addDays(baseDate, 7); // 1 week
            this.container.console.info(`Calculated next publish date from base date: ${nextDate}`);

            await this.updateNextPublishDate(guildId, nextDate);

            return nextDate;
        }

        return new Date(nextDateString);
    }

    private async updateNextPublishDate(guildId: string, nextDate: Date): Promise<void> {
        await this.container.redis.set(`daily:publish:${guildId}`, formatISO(nextDate));
        this.container.console.info('Updated next publish date:', nextDate);
    }

    private async updatedailyTopMessageId(guildId: string, messageId: string): Promise<void> {
        await this.container.prisma.daily_top.update({
            where: { guildId },
            data: { lastDailyTextMessageId: messageId }
        });
        this.container.console.info('Updated daily top message ID:', messageId);
    }

    private async generateDailyVoiceLeaderboard(guildTop10: LeaderboardUserData[]) {
        const bg = ('../../../assets/img/Catto_TXT_Weekly.png');
        const leaderboard = new LeaderboardImageBuilder()
            .setGuildLeaderboard(guildTop10)
            .setBackground(bg)
            .setShowWeeklyMessages(true);
        const lb = await leaderboard.build();
        return lb as Buffer;
    }
}
