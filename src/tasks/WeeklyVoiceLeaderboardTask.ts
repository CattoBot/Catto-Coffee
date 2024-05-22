import { ApplyOptions } from "@sapphire/decorators";
import { ScheduledTask } from "@sapphire/plugin-scheduled-tasks";
import { Time } from "@sapphire/time-utilities";
import { TextChannel } from "discord.js";
import { addDays, formatISO } from "date-fns";
import { createCanvas, loadImage } from "canvas";
import { join } from "path";
import { formatTime, drawRoundedImage, drawProgressBar } from "../lib/utils";

@ApplyOptions<ScheduledTask.Options>({ interval: Time.Hour * 3, name: 'WeeklyVoiceTop10Task' })
export class WeeklyVoiceLeaderboardTask extends ScheduledTask {
    public constructor(context: ScheduledTask.LoaderContext, options: ScheduledTask.Options) {
        super(context, {
            ...options,
        });
    }

    public async run(): Promise<void> {
        const dailyTop = await this.container.prisma.weeklyTop.findMany();
        this.container.console.info('Starting to process weekly tops...', dailyTop);

        for (const top of dailyTop) {
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
                    const newMessage = await textChannel.send({ files: [{ attachment: buffer, name: 'leaderboard.png' }] });
                    this.container.console.info('Sent new weekly top message.');
                    await this.updateWeeklyTopMessageId(guildId, newMessage.id);
                    await this.deleteWeeklyVoiceExperience(guildId);
                }

                const newNextDate = addDays(now, 7); // 24 hours
                await this.updateNextPublishDate(guildId, newNextDate);
            }
        }

        this.container.console.info('Finished run() method.');
    }

    private async getTop10VoiceUsers(guildId: string) {
        this.container.console.info('Fetching top 10 voice users...');
        const top = await this.container.prisma.voiceExperience.findMany({
            where: { guildId },
            take: 10,
            orderBy: { weeklyTimeInVoiceChannel: 'desc' }
        });
        this.container.console.info('Fetched top 10 voice users.', top);
        return top;
    }

    private async deleteWeeklyVoiceExperience(guildId: string) {
        await this.container.prisma.voiceExperience.updateMany({
            where: { guildId },
            data: { weeklyTimeInVoiceChannel: 0 }
        });
        this.container.console.info('Deleted weekly voice experience.');
    }

    private async getChannelId(guildId: string) {
        const channel = await this.container.prisma.leaderboardChannels.findUnique({
            where: { guildId }
        });
        this.container.console.info('Fetched channel ID:', channel?.weeklyVoiceTop10channelId);
        return channel?.weeklyVoiceTop10channelId;
    }

    private async getNextPublishDate(guildId: string): Promise<Date> {
        let nextDateString = await this.container.redis.get(`weekly:publish:${guildId}`);
        this.container.console.info('Fetched next publish date from Redis:', nextDateString);

        if (!nextDateString) {
            const weeklyTop = await this.container.prisma.weeklyTop.findUnique({
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
        await this.container.prisma.weeklyTop.update({
            where: { guildId },
            data: { lastWeeklyMessageId: messageId }
        });
        this.container.console.info('Updated weekly top message ID:', messageId);
    }

    private async generateWeeklyVoiceLeaderboard(guildTop10: any[]) {
        const [backgroundImage] = await Promise.all([
            loadImage(join(__dirname, '../../assets/img/Catto_VC_Weekly.png'))
        ]);

        const imageWidth = 1024;
        const imageHeight = 1440;
        const canvas = createCanvas(imageWidth, imageHeight);
        const context = canvas.getContext('2d');
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const fetchUserData = async (user: any) => {
            const member = await this.container.client.users.fetch(user.userId);
            const avatar = await loadImage(member.displayAvatarURL({ extension: 'jpg', size: 512 }));
            return {
                userInfo: `${member.username} - ${formatTime(user.dailyTimeInVoiceChannel)}`,
                avatar
            };
        };

        const results = await Promise.all(guildTop10.map(fetchUserData));
        const lb = results.map(result => result.userInfo);
        const userAvatars = results.map(result => result.avatar);

        const colors = [
            { start: '#f4b547', end: '#faf3bb' },
            { start: '#04a0ff', end: '#03ddcd' },
            { start: '#ff5394', end: '#ff7064' }
        ];

        let y = Math.floor(imageHeight / 9.6);
        const lineHeight = Math.floor(imageHeight / 10);
        const avatarSpacing = -27.5;
        const avatarSize = Math.floor(imageHeight / 14);

        for (const [index, user] of lb.entries()) {
            const avatar = userAvatars[index];
            const avatarX = imageWidth * 0.12;
            const avatarY = y + lineHeight / 2 - avatarSize;
            drawRoundedImage(context, avatar, avatarX, avatarY, avatarSize);
            const textX = avatarX + avatarSize + Math.floor(imageWidth * 0.03);
            const textY = avatarY + avatarSize / 2 + 6 - Math.floor(imageHeight * 0.02);
            const [username, time] = user.split(' - ');
            context.font = '16px Poppins SemiBold';
            context.fillStyle = '#000000';
            context.textAlign = 'left';
            context.fillText(username, textX, textY);
            const timeTextWidth = context.measureText(time).width;
            const timeX = imageWidth - Math.floor(imageWidth * 0.09) - timeTextWidth;
            context.fillText(time, timeX, textY);
            const progress = guildTop10[index].dailyTimeInVoiceChannel! / (7 * 24 * 60 * 60); // 7 days
            const progressBarX = textX;
            const progressBarY = textY + 30;
            const progressBarWidth = 720;
            const progressBarHeight = 15;
            const color = index < 3 ? colors[index] : { start: '#12D6DF', end: '#F70FFF' };
            drawProgressBar(context, progressBarX, progressBarY, progressBarWidth, progressBarHeight, progress, color.start, color.end);
            y += lineHeight + avatarSpacing;
        }

        const buffer = canvas.toBuffer('image/png');
        return buffer;
    }
}
