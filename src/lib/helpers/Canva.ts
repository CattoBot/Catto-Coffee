import { container } from "@sapphire/pieces";
import { registerFont } from "canvas";
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
        (registerFont)(join(__dirname, '../../../assets/fonts/Poppins-SemiBold.ttf'), { family: 'Poppins SemiBold' });
        (registerFont)(join(__dirname, '../../../assets/fonts/Poppins-Bold.ttf'), { family: 'Poppins Bold' });
        (registerFont)(join(__dirname, '../../../assets/fonts/Bahnschrift.ttf'), { family: 'Bahnschrift' });
    }
}