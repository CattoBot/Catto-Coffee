import { container } from '@sapphire/pieces';
import { createCanvas, loadImage, CanvasRenderingContext2D, Canvas } from 'canvas';
import { join } from 'path';
import { UserInfo } from '../../shared/interfaces/UserInfo';
import { drawFormattedRank, drawProgressBar, drawProgressBarForUser, drawRoundedImage, drawUserAvatar, drawUserData, experienceFormula, formatNumber, formatSecondsToHours, globalexperienceFormula, registeringFONT, retreiveRankCardConfig, wrapText } from '../utils';
import { User } from 'discord.js';

export class DrawCanvas {
    public static async generateProfileCard(user: UserInfo): Promise<Buffer> {
        const { progressBarFirstColor = '#12D6DF', progressBarSecondColor = '#F70FFF' } = (await retreiveRankCardConfig(user.userId)) || {};

        // Constants for canvas dimensions and positions
        const IMAGE_WIDTH = 2500 / 2;
        const IMAGE_HEIGHT = 1285 / 2;
        const AVATAR_SCALE = 1.2;
        const AVATAR_SIZE = 220 * AVATAR_SCALE;
        const AVATAR_OFFSET = 10 * AVATAR_SCALE;
        const AVATAR_X = 130 + IMAGE_WIDTH * 0.03 + AVATAR_OFFSET - AVATAR_SIZE / 2;
        const AVATAR_Y = 200 - IMAGE_HEIGHT * 0.06 - AVATAR_SIZE / 2;
        const PROGRESS_BAR_WIDTH = 800;
        const PROGRESS_BAR_HEIGHT = 35;
        const PROGRESS_BAR_X = 370;
        const PROGRESS_BAR_Y = 250;
        const BADGE_SIZE = 55;
        const BADGE_SPACING = 13;
        const BADGE_CONTAINER_Y = 45;
        const BADGE_CONTAINER_RADIUS = 30;
        const RANK_FONT = '50px Bahnschrift';
        const RANK_CONTAINER_PADDING = 10;
        const RANK_CONTAINER_RADIUS = 30;
        const RANK_CONTAINER_X = 950; // Adjust as needed
        const RANK_CONTAINER_Y = 50;   // Adjust as needed
        const USERNAME_FONT = '30px Poppins';
        const USERNAME_COLOR = '#3D3D3D';
        const USERNAME_X = 370;
        const USERNAME_Y = 210;
        const DISPLAYNAME_FONT = '45px Poppins SemiBold';
        const DISPLAYNAME_COLOR = '#3D3D3D';
        const DISPLAYNAME_X = 370;
        const DISPLAYNAME_Y = 170;
        const LEVEL_FONT = '30px Poppins SemiBold';
        const LEVEL_COLOR = '#3D3D3D';
        const LEVEL_X = 1100;
        const LEVEL_Y = 210;
        const RANK_TEXT_Y_OFFSET = 3;
        const TOTAL_HOURS_X = 1100;
        const TOTAL_HOURS_Y = 398;
        const TOTAL_MESSAGES_X = 1100;
        const TOTAL_MESSAGES_Y = 437;
        const ABOUT_ME_X = 100; // X position of the about me text
        const ABOUT_ME_Y = 385; // Y position of the about me text
        const ABOUT_ME_WIDTH = 600; // Width of the about me text area
        const ABOUT_ME_HEIGHT = 600; // Height of the about me text area
        const ABOUT_ME_FONT = '35px Poppins'; // Font for the about me text
        const ABOUT_ME_COLOR = '#3D3D3D'; // Color for the about me text

        // Create canvas and context
        const canvas: Canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        // Load images
        const bg = await loadImage(join(__dirname, '../../../assets/img/Profile.png'));
        const avatar = await loadImage(user.displayAvatarURL({ extension: 'jpg', size: 512 }));

        // Draw background
        ctx.drawImage(bg, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

        // Draw progress bar
        ctx.lineJoin = 'round';
        ctx.lineWidth = PROGRESS_BAR_HEIGHT;

        // Draw empty bar
        ctx.strokeStyle = '#BEBEBE';
        ctx.strokeRect(PROGRESS_BAR_X, PROGRESS_BAR_Y, PROGRESS_BAR_WIDTH, 0);

        // Draw filled bar
        const experience = user.experience!; // Replace with user's current experience
        const requiredXP = globalexperienceFormula(user.level! + 1) // Calculate required experience for next level
        const gradient = ctx.createLinearGradient(PROGRESS_BAR_X, 0, PROGRESS_BAR_X + PROGRESS_BAR_WIDTH, 0);
        gradient.addColorStop(0, progressBarFirstColor!);
        gradient.addColorStop(0.5, progressBarSecondColor || '#8A2BE2');
        gradient.addColorStop(1, '#F70FFF');

        ctx.strokeStyle = gradient;
        ctx.strokeRect(PROGRESS_BAR_X, PROGRESS_BAR_Y, (PROGRESS_BAR_WIDTH * (experience / requiredXP)), 0);

        // Draw badges
        const userBadges = await this.getUserBadges(user.userId);
        if (userBadges.length > 0) {
            const numBadges = userBadges.length;
            const containerWidth = (numBadges * (BADGE_SIZE + BADGE_SPACING)) - BADGE_SPACING + 20;
            const containerHeight = BADGE_SIZE + 20;
            const containerX = 600 - containerWidth / 2;

            // Draw badge container with rounded corners
            ctx.beginPath();
            ctx.moveTo(containerX + BADGE_CONTAINER_RADIUS, BADGE_CONTAINER_Y);
            ctx.lineTo(containerX + containerWidth - BADGE_CONTAINER_RADIUS, BADGE_CONTAINER_Y);
            ctx.quadraticCurveTo(containerX + containerWidth, BADGE_CONTAINER_Y, containerX + containerWidth, BADGE_CONTAINER_Y + BADGE_CONTAINER_RADIUS);
            ctx.lineTo(containerX + containerWidth, BADGE_CONTAINER_Y + containerHeight - BADGE_CONTAINER_RADIUS);
            ctx.quadraticCurveTo(containerX + containerWidth, BADGE_CONTAINER_Y + containerHeight, containerX + containerWidth - BADGE_CONTAINER_RADIUS, BADGE_CONTAINER_Y + containerHeight);
            ctx.lineTo(containerX + BADGE_CONTAINER_RADIUS, BADGE_CONTAINER_Y + containerHeight);
            ctx.quadraticCurveTo(containerX, BADGE_CONTAINER_Y + containerHeight, containerX, BADGE_CONTAINER_Y + containerHeight - BADGE_CONTAINER_RADIUS);
            ctx.lineTo(containerX, BADGE_CONTAINER_Y + BADGE_CONTAINER_RADIUS);
            ctx.quadraticCurveTo(containerX, BADGE_CONTAINER_Y, containerX + BADGE_CONTAINER_RADIUS, BADGE_CONTAINER_Y);
            ctx.closePath();
            ctx.fillStyle = '#EAEAEA';
            ctx.fill();

            // Draw badges inside the container
            let badgeX = containerX + containerWidth - BADGE_SIZE - 10;
            const badgeY = BADGE_CONTAINER_Y + (containerHeight - BADGE_SIZE) / 2;
            for (let i = userBadges.length - 1; i >= 0; i--) {
                const badge = userBadges[i];
                if (badge.badges.badgeUrl === null) continue;
                ctx.drawImage(await loadImage(badge.badges.badgeUrl), badgeX, badgeY, BADGE_SIZE, BADGE_SIZE);
                badgeX -= BADGE_SIZE + BADGE_SPACING;
            }
        }

        // Draw rank container
        const rankText = `#${user.rank}` || "#2532";
        ctx.font = RANK_FONT;
        const rankMetrics = ctx.measureText(rankText);
        const rankContainerWidth = rankMetrics.width + RANK_CONTAINER_PADDING * 2;
        const rankContainerHeight = 60;

        ctx.beginPath();
        ctx.moveTo(RANK_CONTAINER_X + RANK_CONTAINER_RADIUS, RANK_CONTAINER_Y);
        ctx.lineTo(RANK_CONTAINER_X + rankContainerWidth - RANK_CONTAINER_RADIUS, RANK_CONTAINER_Y);
        ctx.quadraticCurveTo(RANK_CONTAINER_X + rankContainerWidth, RANK_CONTAINER_Y, RANK_CONTAINER_X + rankContainerWidth, RANK_CONTAINER_Y + RANK_CONTAINER_RADIUS);
        ctx.lineTo(RANK_CONTAINER_X + rankContainerWidth, RANK_CONTAINER_Y + rankContainerHeight - RANK_CONTAINER_RADIUS);
        ctx.quadraticCurveTo(RANK_CONTAINER_X + rankContainerWidth, RANK_CONTAINER_Y + rankContainerHeight, RANK_CONTAINER_X + rankContainerWidth - RANK_CONTAINER_RADIUS, RANK_CONTAINER_Y + rankContainerHeight);
        ctx.lineTo(RANK_CONTAINER_X + RANK_CONTAINER_RADIUS, RANK_CONTAINER_Y + rankContainerHeight);
        ctx.quadraticCurveTo(RANK_CONTAINER_X, RANK_CONTAINER_Y + rankContainerHeight, RANK_CONTAINER_X, RANK_CONTAINER_Y + rankContainerHeight - RANK_CONTAINER_RADIUS);
        ctx.lineTo(RANK_CONTAINER_X, RANK_CONTAINER_Y + RANK_CONTAINER_RADIUS);
        ctx.quadraticCurveTo(RANK_CONTAINER_X, RANK_CONTAINER_Y, RANK_CONTAINER_X + RANK_CONTAINER_RADIUS, RANK_CONTAINER_Y);
        ctx.closePath();
        ctx.fillStyle = '#EAEAEA';
        ctx.fill();

        // Add gradient text for rank
        const rankGradient = ctx.createLinearGradient(RANK_CONTAINER_X, 0, RANK_CONTAINER_X + rankContainerWidth, 0);
        rankGradient.addColorStop(0, '#12D6DF');
        rankGradient.addColorStop(0.5, '#8A2BE2');
        rankGradient.addColorStop(1, '#F70FFF');

        ctx.font = RANK_FONT;
        ctx.fillStyle = rankGradient;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; // Center text vertically
        ctx.fillText(rankText, RANK_CONTAINER_X + rankContainerWidth / 2, RANK_CONTAINER_Y + rankContainerHeight / 2 + RANK_TEXT_Y_OFFSET); // Added offset

        // Add other text
        ctx.textAlign = 'left'; // Align text to the left
        ctx.fillStyle = DISPLAYNAME_COLOR;
        ctx.font = DISPLAYNAME_FONT;
        ctx.fillText(`${user.displayName}`, DISPLAYNAME_X, DISPLAYNAME_Y);
        ctx.fillStyle = USERNAME_COLOR;
        ctx.font = USERNAME_FONT;
        ctx.fillText(`${user.username}`, USERNAME_X, USERNAME_Y);
        ctx.fillStyle = LEVEL_COLOR;
        ctx.font = LEVEL_FONT;
        ctx.fillText(`Lv. ${user.level}`, LEVEL_X, LEVEL_Y);
        ctx.font = '25px Poppins SemiBold';
        ctx.fillStyle = '#3D3D3D';
        ctx.fillText(`${formatSecondsToHours(user.totalhours!) || 0}`, TOTAL_HOURS_X, TOTAL_HOURS_Y);
        ctx.fillText(`${user.totalMessages || 0}`, TOTAL_MESSAGES_X, TOTAL_MESSAGES_Y);

        // Draw the "About Me" text box
        ctx.fillStyle = ABOUT_ME_COLOR;
        ctx.font = ABOUT_ME_FONT;
        ctx.textBaseline = 'top'; // Align text to the top
        const aboutMeText = user.aboutMe || "No information given";
        wrapText(ctx, aboutMeText, ABOUT_ME_X, ABOUT_ME_Y, ABOUT_ME_WIDTH, ABOUT_ME_HEIGHT, 40); // 25 is the line height

        // Draw avatar
        ctx.beginPath();
        ctx.arc(AVATAR_X + AVATAR_SIZE / 2, AVATAR_Y + AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, AVATAR_X, AVATAR_Y, AVATAR_SIZE, AVATAR_SIZE);

        return canvas.toBuffer('image/png');
    }


    public static async generateUserRankImage(user: UserInfo, guildId: string, rank: string, requiredXP: number, experience: number, avatarURL: string): Promise<Buffer> {
        // Crear canvas y contexto
        const canvas: Canvas = createCanvas(1000, 300);
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    
        // Constants for positions and dimensions
        const CANVAS_WIDTH = 1000;
        const CANVAS_HEIGHT = 300;
        const AVATAR_SIZE = 220;
        const AVATAR_OFFSET = 10;
        const CIRCLE_RADIUS = 110;
        const BAR_WIDTH = 600;
        const BAR_HEIGHT = 25;
        const BAR_X = 300;
        const BAR_Y = 200;
        const BADGE_SIZE = 40;
        const BADGE_SPACING = 13;
        const CONTAINER_PADDING = 20;
        const CONTAINER_CORNER_RADIUS = 30;
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
    
        // Desestructurar con valores predeterminados en caso de que sean nulos
        const {
            progressBarFirstColor = '#12D6DF',
            progressBarSecondColor = '#F70FFF'
        } = (await retreiveRankCardConfig(user.userId)) || {};
    
        // Cargar imágenes
        const bg = await loadImage(join(__dirname, '../../../assets/img/White_Solid_Card.png'));
        const avatar = await loadImage(avatarURL);
    
        // Ajustar las coordenadas para el avatar
        const circleX = 120 + CANVAS_WIDTH * 0.03 + AVATAR_OFFSET;
        const avatarX = circleX - CIRCLE_RADIUS;
        const circleY = 170 - (CANVAS_HEIGHT * 0.06);
        const avatarY = circleY - CIRCLE_RADIUS;
    
        // Dibujar fondo
        ctx.drawImage(bg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
        // Definir los colores de degradado basados en el rango
        let gradient;
        if (rank === '1') {
            gradient = ctx.createLinearGradient(300, 0, 900, 0);
            gradient.addColorStop(0, '#f4b547'); // Oro
            gradient.addColorStop(1, '#faf3bb'); // Naranja oscuro
        } else if (rank === '2') {
            gradient = ctx.createLinearGradient(300, 0, 900, 0);
            gradient.addColorStop(0, '#04a0ff'); // Plata
            gradient.addColorStop(1, '#03ddcd'); // Gris oscuro
        } else if (rank === '3') {
            gradient = ctx.createLinearGradient(300, 0, 900, 0);
            gradient.addColorStop(0, '#ff5394'); // Bronce
            gradient.addColorStop(1, '#ff7064'); // Marrón oscuro
        } else {
            gradient = ctx.createLinearGradient(300, 0, 900, 0);
            gradient.addColorStop(0, progressBarFirstColor ?? "#12D6DF");
            gradient.addColorStop(1, progressBarSecondColor ?? "#F70FFF");
        }
    
        // Dibujar barra de progreso
        ctx.lineJoin = 'round';
        ctx.lineWidth = BAR_HEIGHT;
    
        // Dibujar barra vacía
        ctx.strokeStyle = '#BEBEBE';
        ctx.strokeRect(BAR_X, BAR_Y, BAR_WIDTH, 0);
    
        // Dibujar barra llena
        ctx.strokeStyle = gradient;
        ctx.strokeRect(BAR_X, BAR_Y, (BAR_WIDTH * (experience / requiredXP)), 0);
    
        // Obtener las badges del usuario y de la guild
        const userBadges = await this.getUserBadges(user.userId);
        const guildBadges = await this.getGuildBadges(guildId);
    
        // Dibujar las badges si hay alguna
        const allBadges = [...userBadges, ...guildBadges];
        if (allBadges.length > 0) {
            const numBadges = allBadges.length;
            const containerWidth = (numBadges * (BADGE_SIZE + BADGE_SPACING)) - BADGE_SPACING + CONTAINER_PADDING;
            const containerHeight = BADGE_SIZE + CONTAINER_PADDING;
            const containerX = 450 - containerWidth / 2;
            const containerY = 22;
    
            // Dibujar el contenedor de las badges con bordes redondeados
            ctx.beginPath();
            ctx.moveTo(containerX + CONTAINER_CORNER_RADIUS, containerY);
            ctx.lineTo(containerX + containerWidth - CONTAINER_CORNER_RADIUS, containerY);
            ctx.quadraticCurveTo(containerX + containerWidth, containerY, containerX + containerWidth, containerY + CONTAINER_CORNER_RADIUS);
            ctx.lineTo(containerX + containerWidth, containerY + containerHeight - CONTAINER_CORNER_RADIUS);
            ctx.quadraticCurveTo(containerX + containerWidth, containerY + containerHeight, containerX + containerWidth - CONTAINER_CORNER_RADIUS, containerY + containerHeight);
            ctx.lineTo(containerX + CONTAINER_CORNER_RADIUS, containerY + containerHeight);
            ctx.quadraticCurveTo(containerX, containerY + containerHeight, containerX, containerY + containerHeight - CONTAINER_CORNER_RADIUS);
            ctx.lineTo(containerX, containerY + CONTAINER_CORNER_RADIUS);
            ctx.quadraticCurveTo(containerX, containerY, containerX + CONTAINER_CORNER_RADIUS, containerY);
            ctx.closePath();
            ctx.fillStyle = '#EAEAEA'; // Color gris claro de fondo del contenedor
            ctx.fill();
    
            // Dibujar las badges dentro del contenedor
            let badgeX = containerX + 10;
            const badgeY = containerY + (containerHeight - BADGE_SIZE) / 2;
            for (const badge of allBadges) {
                if (badge.badges.badgeUrl === null) continue;
                ctx.drawImage(await loadImage(badge.badges.badgeUrl), badgeX, badgeY, BADGE_SIZE, BADGE_SIZE);
                badgeX += BADGE_SIZE + BADGE_SPACING;
            }
        }
    
        // Agregar texto
        ctx.font = '50px Bahnschrift';
        ctx.fillStyle = '#A8A8A8';
        ctx.textAlign = 'center';
        ctx.fillText(`${rank}`, RANK_TEXT_X, RANK_TEXT_Y, 80);
        ctx.fillText('RANK', RANK_LABEL_X, RANK_LABEL_Y, 200);
        ctx.fillStyle = '#3D3D3D';
        ctx.textAlign = 'left'; // Cambiar textAlign a 'left' para que el texto se expanda hacia la derecha
        ctx.font = '25px Poppins SemiBold';
        ctx.fillText(`${user.username}`, USERNAME_X, USERNAME_Y);
        ctx.font = '22px Poppins SemiBold';
        ctx.fillText(`Lv. ${user.level}`, LEVEL_X, LEVEL_Y);
        ctx.font = '25px Poppins SemiBold';
        ctx.fillText(`${formatNumber(experience)} / ${formatNumber(requiredXP)}`, XP_TEXT_X, XP_TEXT_Y);
    
        // Dibujar avatar
        ctx.beginPath();
        ctx.arc(circleX, circleY, CIRCLE_RADIUS, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE);
    
        return canvas.toBuffer('image/png');
    }
    



    private static async getGuildBadges(guildId: string) {
        const badges = await container.prisma.guild_badges.findMany({
            where: {
                guilds: {
                    guildId: guildId
                }
            },
            include: {
                badges: true
            }
        });
        return badges;
    }

    private static async getUserBadges(userId: string) {
        const badges = await container.prisma.user_badges.findMany({
            where: {
                users: {
                    userId: userId
                }
            },
            include: {
                badges: true
            }
        });
        return badges;
    }

    public static async generateLeaderboardImage(guild_leaderboard: any[], userId: string, backgroundImagePath: string) {
        registeringFONT();
        const top10 = guild_leaderboard.slice(0, 10);
        const userRank = guild_leaderboard.findIndex((user) => user.userId === userId) + 1;
        if (userRank === 0) return null;

        const userdata = guild_leaderboard.find((user) => user.userId === userId);
        const [avatarloadimage, backgroundImage] = await Promise.all([
            loadImage(await container.client.users.fetch(userId).then(user => user.displayAvatarURL({ extension: 'jpg', size: 64 }))),
            loadImage(join(__dirname, backgroundImagePath))
        ]);

        const imageWidth = 1024;
        const imageHeight = 1440;
        const canvas = createCanvas(imageWidth, imageHeight);
        const context = canvas.getContext('2d');
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const fetchUserData = async (user: any) => {
            const member = await container.client.users.fetch(user.userId) as User;
            const avatar = await loadImage(member.displayAvatarURL({ extension: 'jpg', size: 128 }));
            return {
                userInfo: `${member.username}\nLevel: ${user.voiceLevel} - XP: ${formatNumber(user.voiceExperience ?? 0)}`,
                avatar
            };
        };

        const results = await Promise.all(top10.map(fetchUserData));
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
            const [username, xp] = user.split(' - XP: ');
            context.font = '16px Poppins SemiBold';
            context.fillStyle = '#000000';
            context.textAlign = 'left';
            context.fillText(username, textX, textY);
            const xpTextWidth = context.measureText(xp).width;
            const xpX = imageWidth - Math.floor(imageWidth * 0.09) - xpTextWidth;
            context.fillText('XP: ' + xp, xpX, textY);
            const progress = top10[index].voiceExperience! / experienceFormula(top10[index].voiceLevel!);
            const progressBarX = textX;
            const progressBarY = textY + 30;
            const progressBarWidth = 720;
            const progressBarHeight = 15;
            const color = index < 3 ? colors[index] : { start: '#12D6DF', end: '#F70FFF' };
            drawProgressBar(context, progressBarX, progressBarY, progressBarWidth, progressBarHeight, progress, color.start, color.end);
            y += lineHeight + avatarSpacing;
        }

        const userBlockX = 100;
        const userBlockY = 1290;

        const userAvatarSize = Math.floor(imageHeight / 15);
        const userAvatarX = userBlockX;
        const userAvatarY = userBlockY;
        drawUserAvatar(context, avatarloadimage, userAvatarX, userAvatarY, userAvatarSize);

        const baseOffset = Math.floor(imageWidth * 0.002);
        const rankX = userAvatarX - baseOffset - 15;
        const rankY = userAvatarY + userAvatarSize / 2 + 6 + 4;
        drawFormattedRank(context, formatNumber(userRank), rankX, rankY);

        const userDataX = userAvatarX + userAvatarSize + Math.floor(imageWidth * 0.03);
        const userDataY = userAvatarY + 20;
        drawUserData(context, await container.client.users.fetch(userId).then(user => user.username), formatNumber(userdata?.voiceLevel!), formatNumber(userdata?.voiceExperience!), userDataX, userDataY);

        const progressForUser = userdata?.voiceExperience! / experienceFormula(userdata?.voiceLevel!);
        const progressBarForUserX = userDataX;
        const progressBarForUserY = userDataY + 40;
        const progressBarForUserWidth = 720;
        const progressBarForUserHeight = 15;
        const userColor = userRank <= 3 ? colors[userRank - 1] : { start: '#12D6DF', end: '#F70FFF' };
        drawProgressBarForUser(context, progressForUser, progressBarForUserX, progressBarForUserY, progressBarForUserWidth, progressBarForUserHeight, userColor.start, userColor.end);

        return canvas.toBuffer('image/png');
    }
}
