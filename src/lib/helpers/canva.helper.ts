import { container } from "@sapphire/pieces";
import { CanvasRenderingContext2D, Image, registerFont, } from 'canvas';
import { join } from "path";
import { Helper } from "./helper";

export class CanvaHelper extends Helper {
    async getUserBadges(userId: string) {
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

    async getGuildBadges(guildId: string) {
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

    registerFonts() {
        registerFont(join(__dirname, '../../../assets/fonts/Poppins-SemiBold.ttf'), { family: 'Poppins SemiBold' });
        registerFont(join(__dirname, '../../../assets/fonts/Poppins-Bold.ttf'), { family: 'Poppins Bold' });
        registerFont(join(__dirname, '../../../assets/fonts/Bahnschrift.ttf'), { family: 'Bahnschrift' });
    }

    drawProgressBar(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, progress: number, startColor: string = '#12D6DF', endColor: string = '#F70FFF') {
        const radius = height / 2;
        const fillWidth = width * progress;

        const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        };

        context.fillStyle = '#BEBEBE';
        drawRoundedRect(context, x, y, width, height, radius);
        context.fill();

        if (progress > 0) {
            const gradient = context.createLinearGradient(x, y, x + fillWidth, y);
            gradient.addColorStop(0, startColor);
            gradient.addColorStop(1, endColor);
            context.fillStyle = gradient;
            drawRoundedRect(context, x, y, fillWidth, height, radius);
            context.fill();
        }
    }

    wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, maxHeight: number, lineHeight: number) {
        const words = text.split(' ');
        let line = '';
        let testLine = '';
        let testWidth = 0;
        let lineCount = 0;

        for (let n = 0; n < words.length; n++) {
            testLine += `${words[n]} `;
            testWidth = context.measureText(testLine).width;

            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = `${words[n]} `;
                y += lineHeight;
                testLine = `${words[n]} `;
                lineCount++;

                if ((lineCount + 1) * lineHeight > maxHeight) {
                    context.fillText('...', x, y);
                    break;
                }
            } else {
                line = testLine;
            }
        }

        if ((lineCount + 1) * lineHeight <= maxHeight) {
            context.fillText(line, x, y);
        }
    }

    drawFormattedRank(context: CanvasRenderingContext2D, rank: string, x: number, y: number) {
        context.font = '25px Poppins SemiBold';
        context.fillStyle = '#A8A8A8';
        context.textAlign = 'right';
        context.fillText(rank, x, y);
    }

    drawUserAvatar(context: CanvasRenderingContext2D, image: Image, x: number, y: number, size: number) {
        context.save();
        context.beginPath();
        context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(image, x, y, size, size);
        context.restore();
    }

    drawRoundedImage(context: CanvasRenderingContext2D, image: Image, x: number, y: number, size: number) {
        context.save();
        context.beginPath();
        context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(image, x, y, size, size);
        context.restore();
    }

    drawUserData(context: CanvasRenderingContext2D, username: string, level: string, xp: string, x: number, y: number) {
        context.font = '16px Poppins SemiBold';
        context.fillStyle = '#000000';
        context.textAlign = 'left';
        context.fillText(username + ' (You)', x, y + 12);
        context.fillText(`Level: ${level}`, x, y + 32);
        context.fillText(`XP: ${xp}`, x + 650, y + 10);
    }

    drawProgressBarForUser(context: CanvasRenderingContext2D, progress: number, x: number, y: number, width: number, height: number, startColor: string = '#12D6DF', endColor: string = '#F70FFF') {
        const radius = height / 2;
        const filledWidth = width * progress;

        const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        };

        context.fillStyle = '#BEBEBE';
        drawRoundedRect(context, x, y, width, height, radius);
        context.fill();

        if (progress > 0) {
            const gradient = context.createLinearGradient(x, y, x + filledWidth, y);
            gradient.addColorStop(0, startColor);
            gradient.addColorStop(1, endColor);
            context.fillStyle = gradient;
            drawRoundedRect(context, x, y, filledWidth, height, radius);
            context.fill();
        }
    }
}