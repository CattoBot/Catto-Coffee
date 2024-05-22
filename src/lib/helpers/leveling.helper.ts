import { container } from "@sapphire/pieces";
import { Helper } from "./helper";
import { RoleReward } from "../../shared/types/Rewards";

export class LevelingHelper extends Helper {
    public static async getVoiceXPEnabled(guildId: string) {
        const result = await container.prisma.iVoiceExperience.findUnique({ where: { guildId } });
        return result?.isEnabled ?? false;
    }

    public static async getTextXPEnabled(guildId: string) {
        const result = await container.prisma.iTextExperience.findUnique({ where: { guildId } });
        return result?.isEnabled ?? false;
    }

    public static async getTextLeaderboard(guildId: string) {
        const lb = await container.prisma.textExperience.findMany({
            where: {
                guildId: guildId
            }, take: 50,
            orderBy: [
                {
                    textLevel: 'desc'
                },
                {
                    textExperience: 'desc'
                }
            ]
        });
        return lb;
    }

    public static async getVoiceLeaderboard(guildId: string) {
        const lb = await container.prisma.voiceExperience.findMany({
            where: {
                guildId: guildId
            }, orderBy: [
                {
                    voiceLevel: 'desc'
                },
                {
                    voiceExperience: 'desc'
                }
            ], take: 50
        });
        return lb;
    }

    public static async getTextRewards(guildId: string): Promise<RoleReward[]> {
        const rewards = await container.prisma.experienceRoleRewards.findMany({
            where: { guildId }
        });
        return rewards.filter(reward => reward.roleType === 'text') as RoleReward[];
    }

    public static async getVoiceRewards(guildId: string): Promise<RoleReward[]> {
        const rewards = await container.prisma.experienceRoleRewards.findMany({
            where: { guildId }
        });
        return rewards.filter(reward => reward.roleType === 'voice') as RoleReward[];
    }

    public static async getVoiceRank(userId: string, guildId: string) {
        const users = await container.prisma.voiceExperience.findMany({
            where: { guildId },
            orderBy: [
                {
                    voiceLevel: 'desc'
                },
                {
                    voiceExperience: 'desc'
                }
            ]
        });
        const userIndex = users.findIndex(user => user.userId === userId);
        return userIndex === -1 ? null : userIndex + 1;
    }

    public static async getTextRank(userId: string, guildId: string) {
        const users = await container.prisma.textExperience.findMany({
            where: { guildId },
            orderBy: { textExperience: 'desc' }
        });
        const userIndex = users.findIndex(user => user.userId === userId);
        return userIndex === -1 ? null : userIndex + 1;
    }

    public static async getVoiceUserInfo(userId: string, guildId: string) {
        return await container.prisma.voiceExperience.findUnique({
            where: {
                guildId_userId: {
                    userId,
                    guildId,
                }
            }
        });
    }

    public static async getTextUserInfo(userId: string, guildId: string) {
        return await container.prisma.textExperience.findUnique({
            where: {
                guildId_userId: {
                    userId,
                    guildId,
                }
            }
        });
    }

}