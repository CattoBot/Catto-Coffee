import { createCanvas, Canvas, CanvasRenderingContext2D, loadImage, Image } from 'canvas';
import { join } from 'path';
import { container } from '@sapphire/pieces';
import { UserInfo } from '../../shared/interfaces/UserInfo';

export class ProfileCardBuilder {
    private user: UserInfo;
    private canvas: Canvas;
    private ctx: CanvasRenderingContext2D;
    private IMAGE_WIDTH = 2500 / 2;
    private IMAGE_HEIGHT = 1285 / 2;
    private AVATAR_SCALE = 1.2;
    private AVATAR_SIZE = 220 * this.AVATAR_SCALE;
    private AVATAR_OFFSET = 10 * this.AVATAR_SCALE;
    private AVATAR_X = 130 + this.IMAGE_WIDTH * 0.03 + this.AVATAR_OFFSET - this.AVATAR_SIZE / 2;
    private AVATAR_Y = 200 - this.IMAGE_HEIGHT * 0.06 - this.AVATAR_SIZE / 2;
    private PROGRESS_BAR_WIDTH = 800;
    private PROGRESS_BAR_HEIGHT = 35;
    private PROGRESS_BAR_X = 370;
    private PROGRESS_BAR_Y = 250;
    private BADGE_SIZE = 55;
    private BADGE_SPACING = 13;
    private BADGE_CONTAINER_Y = 45;
    private BADGE_CONTAINER_RADIUS = 30;
    private RANK_FONT = '50px Bahnschrift';
    private RANK_CONTAINER_PADDING = 10;
    private RANK_CONTAINER_RADIUS = 30;
    private RANK_CONTAINER_X = 950;
    private RANK_CONTAINER_Y = 50;
    private USERNAME_FONT = '30px Poppins';
    private USERNAME_COLOR = '#3D3D3D';
    private USERNAME_X = 370;
    private USERNAME_Y = 210;
    private DISPLAYNAME_FONT = '45px Poppins SemiBold';
    private DISPLAYNAME_COLOR = '#3D3D3D';
    private DISPLAYNAME_X = 370;
    private DISPLAYNAME_Y = 170;
    private LEVEL_FONT = '30px Poppins SemiBold';
    private LEVEL_COLOR = '#3D3D3D';
    private LEVEL_X = 1100;
    private LEVEL_Y = 210;
    private RANK_TEXT_Y_OFFSET = 3;
    private TOTAL_HOURS_X = 1100;
    private TOTAL_HOURS_Y = 398;
    private TOTAL_MESSAGES_X = 1100;
    private TOTAL_MESSAGES_Y = 437;
    private ABOUT_ME_X = 100;
    private ABOUT_ME_Y = 385;
    private ABOUT_ME_WIDTH = 600;
    private ABOUT_ME_HEIGHT = 600;
    private ABOUT_ME_FONT = '35px Poppins';
    private ABOUT_ME_COLOR = '#3D3D3D';

    constructor(user: UserInfo) {
        this.user = user;
        this.canvas = createCanvas(this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
        this.ctx = this.canvas.getContext('2d');
    }

    private async loadImages() {
        const bg = await loadImage(join(__dirname, '../../../assets/img/Profile.png'));
        const avatar = await loadImage(this.user.displayAvatarURL({ extension: 'jpg', size: 512 }));
        return { bg, avatar };
    }

    private drawBackground(bg: Image) {
        this.ctx.drawImage(bg, 0, 0, this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
    }

    private drawProgressBar(experience: number, requiredXP: number) {
        const gradient = this.ctx.createLinearGradient(this.PROGRESS_BAR_X, 0, this.PROGRESS_BAR_X + this.PROGRESS_BAR_WIDTH, 0);
        gradient.addColorStop(0, '#12D6DF');
        gradient.addColorStop(0.5, '#F70FFF');
        gradient.addColorStop(1, '#F70FFF');

        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = this.PROGRESS_BAR_HEIGHT;

        // Draw empty bar
        this.ctx.strokeStyle = '#BEBEBE';
        this.ctx.strokeRect(this.PROGRESS_BAR_X, this.PROGRESS_BAR_Y, this.PROGRESS_BAR_WIDTH, 0);

        // Draw filled bar
        this.ctx.strokeStyle = gradient;
        this.ctx.strokeRect(this.PROGRESS_BAR_X, this.PROGRESS_BAR_Y, (this.PROGRESS_BAR_WIDTH * (experience / requiredXP)), 0);
    }

    private async drawBadges() {
        const userBadges = await container.helpers.canvas.getUserBadges(this.user.userId);
        if (userBadges.length > 0) {
            const numBadges = userBadges.length;
            const containerWidth = (numBadges * (this.BADGE_SIZE + this.BADGE_SPACING)) - this.BADGE_SPACING + 20;
            const containerHeight = this.BADGE_SIZE + 20;
            const containerX = 600 - containerWidth / 2;

            // Draw badge container with rounded corners
            this.ctx.beginPath();
            this.ctx.moveTo(containerX + this.BADGE_CONTAINER_RADIUS, this.BADGE_CONTAINER_Y);
            this.ctx.lineTo(containerX + containerWidth - this.BADGE_CONTAINER_RADIUS, this.BADGE_CONTAINER_Y);
            this.ctx.quadraticCurveTo(containerX + containerWidth, this.BADGE_CONTAINER_Y, containerX + containerWidth, this.BADGE_CONTAINER_Y + this.BADGE_CONTAINER_RADIUS);
            this.ctx.lineTo(containerX + containerWidth, this.BADGE_CONTAINER_Y + containerHeight - this.BADGE_CONTAINER_RADIUS);
            this.ctx.quadraticCurveTo(containerX + containerWidth, this.BADGE_CONTAINER_Y + containerHeight, containerX + containerWidth - this.BADGE_CONTAINER_RADIUS, this.BADGE_CONTAINER_Y + containerHeight);
            this.ctx.lineTo(containerX + this.BADGE_CONTAINER_RADIUS, this.BADGE_CONTAINER_Y + containerHeight);
            this.ctx.quadraticCurveTo(containerX, this.BADGE_CONTAINER_Y + containerHeight, containerX, this.BADGE_CONTAINER_Y + containerHeight - this.BADGE_CONTAINER_RADIUS);
            this.ctx.lineTo(containerX, this.BADGE_CONTAINER_Y + this.BADGE_CONTAINER_RADIUS);
            this.ctx.quadraticCurveTo(containerX, this.BADGE_CONTAINER_Y, containerX + this.BADGE_CONTAINER_RADIUS, this.BADGE_CONTAINER_Y);
            this.ctx.closePath();
            this.ctx.fillStyle = '#EAEAEA';
            this.ctx.fill();

            // Draw badges inside the container
            let badgeX = containerX + containerWidth - this.BADGE_SIZE - 10;
            const badgeY = this.BADGE_CONTAINER_Y + (containerHeight - this.BADGE_SIZE) / 2;
            for (let i = userBadges.length - 1; i >= 0; i--) {
                const badge = userBadges[i];
                if (badge.badges.badgeUrl === null) continue;
                this.ctx.drawImage(await loadImage(badge.badges.badgeUrl), badgeX, badgeY, this.BADGE_SIZE, this.BADGE_SIZE);
                badgeX -= this.BADGE_SIZE + this.BADGE_SPACING;
            }
        }
    }

    private drawRank() {
        const rankText = `#${this.user.rank}` || "#2532";
        this.ctx.font = this.RANK_FONT;
        const rankMetrics = this.ctx.measureText(rankText);
        const rankContainerWidth = rankMetrics.width + this.RANK_CONTAINER_PADDING * 2;
        const rankContainerHeight = 60;

        this.ctx.beginPath();
        this.ctx.moveTo(this.RANK_CONTAINER_X + this.RANK_CONTAINER_RADIUS, this.RANK_CONTAINER_Y);
        this.ctx.lineTo(this.RANK_CONTAINER_X + rankContainerWidth - this.RANK_CONTAINER_RADIUS, this.RANK_CONTAINER_Y);
        this.ctx.quadraticCurveTo(this.RANK_CONTAINER_X + rankContainerWidth, this.RANK_CONTAINER_Y, this.RANK_CONTAINER_X + rankContainerWidth, this.RANK_CONTAINER_Y + this.RANK_CONTAINER_RADIUS);
        this.ctx.lineTo(this.RANK_CONTAINER_X + rankContainerWidth, this.RANK_CONTAINER_Y + rankContainerHeight - this.RANK_CONTAINER_RADIUS);
        this.ctx.quadraticCurveTo(this.RANK_CONTAINER_X + rankContainerWidth, this.RANK_CONTAINER_Y + rankContainerHeight, this.RANK_CONTAINER_X + rankContainerWidth - this.RANK_CONTAINER_RADIUS, this.RANK_CONTAINER_Y + rankContainerHeight);
        this.ctx.lineTo(this.RANK_CONTAINER_X + this.RANK_CONTAINER_RADIUS, this.RANK_CONTAINER_Y + rankContainerHeight);
        this.ctx.quadraticCurveTo(this.RANK_CONTAINER_X, this.RANK_CONTAINER_Y + rankContainerHeight, this.RANK_CONTAINER_X, this.RANK_CONTAINER_Y + rankContainerHeight - this.RANK_CONTAINER_RADIUS);
        this.ctx.lineTo(this.RANK_CONTAINER_X, this.RANK_CONTAINER_Y + this.RANK_CONTAINER_RADIUS);
        this.ctx.quadraticCurveTo(this.RANK_CONTAINER_X, this.RANK_CONTAINER_Y, this.RANK_CONTAINER_X + this.RANK_CONTAINER_RADIUS, this.RANK_CONTAINER_Y);
        this.ctx.closePath();
        this.ctx.fillStyle = '#EAEAEA';
        this.ctx.fill();

        // Add gradient text for rank
        const rankGradient = this.ctx.createLinearGradient(this.RANK_CONTAINER_X, 0, this.RANK_CONTAINER_X + rankContainerWidth, 0);
        rankGradient.addColorStop(0, '#12D6DF');
        rankGradient.addColorStop(0.5, '#8A2BE2');
        rankGradient.addColorStop(1, '#F70FFF');

        this.ctx.font = this.RANK_FONT;
        this.ctx.fillStyle = rankGradient;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(rankText, this.RANK_CONTAINER_X + rankContainerWidth / 2, this.RANK_CONTAINER_Y + rankContainerHeight / 2 + this.RANK_TEXT_Y_OFFSET);
    }

    private drawText() {
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = this.DISPLAYNAME_COLOR;
        this.ctx.font = this.DISPLAYNAME_FONT;
        this.ctx.fillText(`${this.user.displayName}`, this.DISPLAYNAME_X, this.DISPLAYNAME_Y);
        this.ctx.fillStyle = this.USERNAME_COLOR;
        this.ctx.font = this.USERNAME_FONT;
        this.ctx.fillText(`${this.user.username}`, this.USERNAME_X, this.USERNAME_Y);
        this.ctx.fillStyle = this.LEVEL_COLOR;
        this.ctx.font = this.LEVEL_FONT;
        this.ctx.fillText(`Lv. ${this.user.level}`, this.LEVEL_X, this.LEVEL_Y);
        this.ctx.font = '25px Poppins SemiBold';
        this.ctx.fillStyle = '#3D3D3D';
        this.ctx.fillText(`${container.utils.time.convert(this.user.totalhours!, 'seconds', 'hours') || 0}`, this.TOTAL_HOURS_X, this.TOTAL_HOURS_Y);
        this.ctx.fillText(`${this.user.totalMessages || 0}`, this.TOTAL_MESSAGES_X, this.TOTAL_MESSAGES_Y);
    }

    private drawAboutMe() {
        this.ctx.fillStyle = this.ABOUT_ME_COLOR;
        this.ctx.font = this.ABOUT_ME_FONT;
        this.ctx.textBaseline = 'top';
        const aboutMeText = this.user.aboutMe || "No information given";
        container.helpers.canvas.wrapText(this.ctx, aboutMeText, this.ABOUT_ME_X, this.ABOUT_ME_Y, this.ABOUT_ME_WIDTH, this.ABOUT_ME_HEIGHT, 40);
    }

    private drawAvatar(avatar: Image) {
        this.ctx.beginPath();
        this.ctx.arc(this.AVATAR_X + this.AVATAR_SIZE / 2, this.AVATAR_Y + this.AVATAR_SIZE / 2, this.AVATAR_SIZE / 2, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.clip();
        this.ctx.drawImage(avatar, this.AVATAR_X, this.AVATAR_Y, this.AVATAR_SIZE, this.AVATAR_SIZE);
    }

    public async build(): Promise<Buffer> {
        container.helpers.canvas.registerFonts();
        const { bg, avatar } = await this.loadImages();
        this.drawBackground(bg);
        const experience = this.user.experience!;
        const requiredXP = container.utils.xp.globalexperienceFormula(this.user.level! + 1);
        this.drawProgressBar(experience, requiredXP);
        await this.drawBadges();
        this.drawRank();
        this.drawText();
        this.drawAboutMe();
        this.drawAvatar(avatar);
        return this.canvas.toBuffer('image/png');
    }
}
