import { CanvasRenderingContext2D, createCanvas, Image, loadImage } from 'canvas';
import { join } from 'path';
import { User } from 'discord.js';
import { container } from '@sapphire/framework';
import { formatNumber, drawRoundedImage, drawProgressBar, drawUserAvatar, drawFormattedRank, drawUserData } from '../utils';
import { LeaderboardUserData } from '../../shared/interfaces/LeaderboardUser';
import { FetchUserData } from '../../shared/interfaces/UserData';
import { CanvaHelper } from '../helpers/Canva';
import { LeaderboardType } from '../../shared/types/LeaderboardType';

export class LeaderboardImageBuilder extends CanvaHelper {
    private guildLeaderboard: LeaderboardUserData[] = [];
    private userId: string | null = null;
    private backgroundImagePath: string = '';
    private experienceFormula: (level: number) => number = (level: number) => Math.floor(100 * Math.pow(level, 1.5));
    private type: LeaderboardType = 'voice';

    setGuildLeaderboard(guildLeaderboard: LeaderboardUserData[]): LeaderboardImageBuilder {
        this.guildLeaderboard = guildLeaderboard;
        return this;
    }

    setUserId(userId: string): LeaderboardImageBuilder {
        this.userId = userId;
        return this;
    }

    setBackground(backgroundImagePath: string): LeaderboardImageBuilder {
        this.backgroundImagePath = backgroundImagePath;
        return this;
    }

    setExperienceFormula(formula: (level: number) => number): LeaderboardImageBuilder {
        this.experienceFormula = formula;
        return this;
    }

    setType(type: 'voice' | 'text'): LeaderboardImageBuilder {
        this.type = type;
        return this;
    }

    // Fetch user data
    private async fetchUserData(user: LeaderboardUserData): Promise<FetchUserData> {
        const member = await container.client.users.fetch(user.userId) as User;
        const avatar = await loadImage(member.displayAvatarURL({ extension: 'jpg', size: 128 }));

        const level = this.type === 'voice' ? user.voiceLevel : user.textLevel;
        const experience = this.type === 'voice' ? user.voiceExperience : user.textExperience;

        return {
            userInfo: `${member.username}\nLevel: ${level} - XP: ${formatNumber(experience ?? 0)}`,
            avatar
        };
    }

    private async drawLeaderboard(context: CanvasRenderingContext2D, top10: LeaderboardUserData[]): Promise<void> {
        const results = await Promise.all(top10.map(user => this.fetchUserData(user)));
        const lb = results.map(result => result.userInfo);
        const userAvatars = results.map(result => result.avatar);

        const colors = [
            { start: '#f4b547', end: '#faf3bb' },
            { start: '#04a0ff', end: '#03ddcd' },
            { start: '#ff5394', end: '#ff7064' }
        ];

        let y = Math.floor(1440 / 9.6);
        const lineHeight = Math.floor(1440 / 10);
        const avatarSpacing = -27.5;
        const avatarSize = Math.floor(1440 / 14);

        lb.forEach((user, index) => {
            const avatar = userAvatars[index];
            const avatarX = 1024 * 0.12;
            const avatarY = y + lineHeight / 2 - avatarSize;
            drawRoundedImage(context, avatar, avatarX, avatarY, avatarSize);

            const textX = avatarX + avatarSize + Math.floor(1024 * 0.03);
            const textY = avatarY + avatarSize / 2 + 6 - Math.floor(1440 * 0.02);
            const [username, xp] = user.split(' - XP: ');
            context.font = '16px Poppins SemiBold';
            context.fillStyle = '#000000';
            context.textAlign = 'left';
            context.fillText(username, textX, textY);

            const xpTextWidth = context.measureText(xp).width;
            const xpX = 1024 - Math.floor(1024 * 0.09) - xpTextWidth;
            context.fillText('XP: ' + xp, xpX, textY);

            const progress = top10[index][`${this.type}Experience`]! / this.experienceFormula(top10[index][`${this.type}Level`]!);
            const progressBarX = textX;
            const progressBarY = textY + 30;
            const progressBarWidth = 720;
            const progressBarHeight = 15;
            const color = index < 3 ? colors[index] : { start: '#12D6DF', end: '#F70FFF' };
            drawProgressBar(context, progressBarX, progressBarY, progressBarWidth, progressBarHeight, progress, color.start, color.end);

            y += lineHeight + avatarSpacing;
        });
    }

    private async drawUserSection(context: CanvasRenderingContext2D, userId: string, userRank: number, userdata: LeaderboardUserData, avatarloadimage: Image): Promise<void> {
        const userBlockX = 100;
        const userBlockY = 1290;
        const userAvatarSize = Math.floor(1440 / 15);
        const userAvatarX = userBlockX;
        const userAvatarY = userBlockY;
        drawUserAvatar(context, avatarloadimage, userAvatarX, userAvatarY, userAvatarSize);

        const baseOffset = Math.floor(1024 * 0.002);
        const rankX = userAvatarX - baseOffset - 15;
        const rankY = userAvatarY + userAvatarSize / 2 + 6 + 4;
        drawFormattedRank(context, formatNumber(userRank), rankX, rankY);

        const userDataX = userAvatarX + userAvatarSize + Math.floor(1024 * 0.03);
        const userDataY = userAvatarY + 20;
        drawUserData(context, await container.client.users.fetch(userId).then(user => user.username), formatNumber(userdata[`${this.type}Level`] ?? 0), formatNumber(userdata[`${this.type}Experience`] ?? 0), userDataX, userDataY);

        const progressForUser = (userdata[`${this.type}Experience`] ?? 0) / this.experienceFormula(userdata[`${this.type}Level`] ?? 0);
        const progressBarForUserX = userDataX;
        const progressBarForUserY = userDataY + 40;
        const progressBarForUserWidth = 720;
        const progressBarForUserHeight = 15;
        const colors = [
            { start: '#f4b547', end: '#faf3bb' },
            { start: '#04a0ff', end: '#03ddcd' },
            { start: '#ff5394', end: '#ff7064' }
        ];
        const userColor = userRank <= 3 ? colors[userRank - 1] : { start: '#12D6DF', end: '#F70FFF' };
        drawProgressBar(context, progressBarForUserX, progressBarForUserY, progressBarForUserWidth, progressBarForUserHeight, progressForUser, userColor.start, userColor.end);
    }

    public async build(): Promise<Buffer | null> {
        this.registerFonts()
        if (!this.guildLeaderboard.length || !this.backgroundImagePath) {
            throw new Error('Guild leaderboard and background image path must be set.');
        }

        const top10 = this.guildLeaderboard.slice(0, 10);
        const userRank = this.userId ? this.guildLeaderboard.findIndex((user) => user.userId === this.userId) + 1 : 0;
        const userdata = this.userId ? this.guildLeaderboard.find((user) => user.userId === this.userId) : null;

        const [avatarloadimage, backgroundImage] = await Promise.all([
            this.userId ? loadImage(await container.client.users.fetch(this.userId).then(user => user.displayAvatarURL({ extension: 'jpg', size: 256 }))) : null,
            loadImage(join(__dirname, this.backgroundImagePath))
        ]);

        const imageWidth = 1024;
        const imageHeight = 1440;
        const canvas = createCanvas(imageWidth, imageHeight);
        const context = canvas.getContext('2d');
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        await this.drawLeaderboard(context, top10);

        if (this.userId && userdata) {
            await this.drawUserSection(context, this.userId, userRank, userdata, avatarloadimage!);
        }

        return canvas.toBuffer('image/png');
    }
}
