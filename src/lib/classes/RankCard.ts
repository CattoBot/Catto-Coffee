import { createCanvas, loadImage, Canvas, CanvasRenderingContext2D, Image } from 'canvas';
import { join } from 'path';
import { container } from '@sapphire/pieces';
import { UserInfo } from '../../shared/interfaces/UserInfo';

export class RankCardBuilder {
	private canvas: Canvas;
	private ctx: CanvasRenderingContext2D;
	private user?: UserInfo;
	private guildId?: string;
	private rank?: string;
	private requiredXP?: number;
	private experience?: number;
	private avatarURL?: string;
	private progressBarFirstColor: string = '#12D6DF';
	private progressBarSecondColor: string = '#F70FFF';

	constructor() {
		this.canvas = createCanvas(1000, 300);
		this.ctx = this.canvas.getContext('2d');
	}

	public setUser(user: UserInfo): this {
		this.user = user;
		return this;
	}

	public setGuildId(guildId: string): this {
		this.guildId = guildId;
		return this;
	}

	public setRank(rank: string): this {
		this.rank = rank;
		return this;
	}

	public setRequiredXP(requiredXP: number): this {
		this.requiredXP = requiredXP;
		return this;
	}

	public setExperience(experience: number): this {
		this.experience = experience;
		return this;
	}

	public setAvatarURL(avatarURL: string): this {
		this.avatarURL = avatarURL;
		return this;
	}

	public setProgressBarColors(firstColor: string, secondColor: string): this {
		this.progressBarFirstColor = firstColor;
		this.progressBarSecondColor = secondColor;
		return this;
	}

	private async loadImage(src: string): Promise<Image> {
		return loadImage(src);
	}

	private drawBackground(bg: Image) {
		const { ctx, canvas } = this;
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
	}

	private drawProgressBar() {
		const { ctx, rank, experience, requiredXP } = this;
		const BAR_WIDTH = 600;
		const BAR_HEIGHT = 25;
		const BAR_X = 300;
		const BAR_Y = 200;

		if (rank === undefined || experience === undefined || requiredXP === undefined) {
			throw new Error('Rank, experience, and requiredXP must be set.');
		}

		let gradient = ctx.createLinearGradient(300, 0, 900, 0);
		if (rank === '1') {
			gradient.addColorStop(0, '#f4b547'); // Oro
			gradient.addColorStop(1, '#faf3bb'); // Naranja oscuro
		} else if (rank === '2') {
			gradient.addColorStop(0, '#04a0ff'); // Plata
			gradient.addColorStop(1, '#03ddcd'); // Gris oscuro
		} else if (rank === '3') {
			gradient.addColorStop(0, '#ff5394'); // Bronce
			gradient.addColorStop(1, '#ff7064'); // Marrón oscuro
		} else {
			gradient.addColorStop(0, this.progressBarFirstColor);
			gradient.addColorStop(1, this.progressBarSecondColor);
		}

		ctx.lineJoin = 'round';
		ctx.lineWidth = BAR_HEIGHT;

		ctx.strokeStyle = '#BEBEBE';
		ctx.strokeRect(BAR_X, BAR_Y, BAR_WIDTH, 0);

		ctx.strokeStyle = gradient;
		ctx.strokeRect(BAR_X, BAR_Y, BAR_WIDTH * (experience / requiredXP), 0);
	}

	private async drawBadges() {
		const { ctx, guildId, user } = this;
		const BADGE_SIZE = 40;
		const BADGE_SPACING = 13;
		const CONTAINER_PADDING = 20;
		const CONTAINER_CORNER_RADIUS = 30;

		if (user === undefined || guildId === undefined) {
			throw new Error('User and guildId must be set.');
		}

		const userBadges = await container.helpers.canvas.getUserBadges(user.userId);
		const guildBadges = await container.helpers.canvas.getGuildBadges(guildId);

		const allBadges = [...userBadges, ...guildBadges];
		if (allBadges.length > 0) {
			const numBadges = allBadges.length;
			const containerWidth = numBadges * (BADGE_SIZE + BADGE_SPACING) - BADGE_SPACING + CONTAINER_PADDING;
			const containerHeight = BADGE_SIZE + CONTAINER_PADDING;
			const containerX = 450 - containerWidth / 2;
			const containerY = 22;

			ctx.beginPath();
			ctx.moveTo(containerX + CONTAINER_CORNER_RADIUS, containerY);
			ctx.lineTo(containerX + containerWidth - CONTAINER_CORNER_RADIUS, containerY);
			ctx.quadraticCurveTo(containerX + containerWidth, containerY, containerX + containerWidth, containerY + CONTAINER_CORNER_RADIUS);
			ctx.lineTo(containerX + containerWidth, containerY + containerHeight - CONTAINER_CORNER_RADIUS);
			ctx.quadraticCurveTo(
				containerX + containerWidth,
				containerY + containerHeight,
				containerX + containerWidth - CONTAINER_CORNER_RADIUS,
				containerY + containerHeight
			);
			ctx.lineTo(containerX + CONTAINER_CORNER_RADIUS, containerY + containerHeight);
			ctx.quadraticCurveTo(containerX, containerY + containerHeight, containerX, containerY + containerHeight - CONTAINER_CORNER_RADIUS);
			ctx.lineTo(containerX, containerY + CONTAINER_CORNER_RADIUS);
			ctx.quadraticCurveTo(containerX, containerY, containerX + CONTAINER_CORNER_RADIUS, containerY);
			ctx.closePath();
			ctx.fillStyle = '#EAEAEA';
			ctx.fill();

			let badgeX = containerX + 10;
			const badgeY = containerY + (containerHeight - BADGE_SIZE) / 2;
			for (const badge of allBadges) {
				if (badge.badges.badgeUrl === null) continue;
				ctx.drawImage(await this.loadImage(badge.badges.badgeUrl), badgeX, badgeY, BADGE_SIZE, BADGE_SIZE);
				badgeX += BADGE_SIZE + BADGE_SPACING;
			}
		}
	}

	private drawText() {
		const { ctx, user, rank, experience, requiredXP } = this;
		const RANK_TEXT_X = 800;
		const RANK_TEXT_Y = 70;
		const RANK_LABEL_X = 680;
		const RANK_LABEL_Y = 70;
		const USERNAME_X = 300;
		const USERNAME_Y = 155;
		const LEVEL_X = 300;
		const LEVEL_Y = 180;
		const XP_TEXT_X = 780;
		const XP_TEXT_Y = 170;

		if (user === undefined || rank === undefined || experience === undefined || requiredXP === undefined) {
			throw new Error('User, rank, experience, and requiredXP must be set.');
		}

		ctx.font = '50px Bahnschrift';
		ctx.fillStyle = '#A8A8A8';
		ctx.textAlign = 'center';
		ctx.fillText(`${rank}`, RANK_TEXT_X, RANK_TEXT_Y, 80);
		ctx.fillText('RANK', RANK_LABEL_X, RANK_LABEL_Y, 200);
		ctx.fillStyle = '#3D3D3D';
		ctx.textAlign = 'left';
		ctx.font = '25px Poppins SemiBold';
		ctx.fillText(`${user.username}`, USERNAME_X, USERNAME_Y);
		ctx.font = '22px Poppins SemiBold';
		ctx.fillText(`Lv. ${user.level}`, LEVEL_X, LEVEL_Y);
		ctx.font = '25px Poppins SemiBold';
		ctx.fillText(`${container.utils.numbers.format(experience)} / ${container.utils.numbers.format(requiredXP)}`, XP_TEXT_X, XP_TEXT_Y);
	}

	private drawAvatar(avatar: Image) {
		const { ctx, canvas } = this;
		const CIRCLE_RADIUS = 110;
		const AVATAR_SIZE = 220;
		const CANVAS_WIDTH = canvas.width;
		const CANVAS_HEIGHT = canvas.height;
		const AVATAR_OFFSET = 10;

		const circleX = 120 + CANVAS_WIDTH * 0.03 + AVATAR_OFFSET;
		const avatarX = circleX - CIRCLE_RADIUS;
		const circleY = 170 - CANVAS_HEIGHT * 0.06;
		const avatarY = circleY - CIRCLE_RADIUS;

		ctx.beginPath();
		ctx.arc(circleX, circleY, CIRCLE_RADIUS, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatar, avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE);
	}

	public async build(): Promise<Buffer> {
		container.helpers.canvas.registerFonts();
		if (!this.avatarURL) {
			throw new Error('Avatar URL must be set.');
		}

		const bg = await this.loadImage(join(__dirname, '../../../assets/img/White_Solid_Card.png'));
		const avatar = await this.loadImage(this.avatarURL);

		this.drawBackground(bg);
		this.drawProgressBar();
		await this.drawBadges();
		this.drawText();
		this.drawAvatar(avatar);

		return this.canvas.toBuffer('image/png');
	}
}
