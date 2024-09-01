import { container } from "@sapphire/pieces";
import { Helper } from "./helper";
import { RoleReward } from "../../shared/types/Rewards";

export class LevelingHelper extends Helper {
    public async getVoiceXPEnabled(guildId: string) {
        const result = await container.prisma.i_voice_experience.findUnique({ where: { guildId } });
        return result?.isEnabled ?? false;
    }

    public async getTextXPEnabled(guildId: string) {
        const result = await container.prisma.i_text_experience.findUnique({ where: { guildId } });
        return result?.isEnabled ?? false;
    }

    public async getTextLeaderboard(guildId: string) {
        const lb = await container.prisma.text_experience.findMany({
            where: {
                guildId: guildId
            }, take: 999,
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

    public async getVoiceLeaderboard(guildId: string) {
        const lb = await container.prisma.voice_experience.findMany({
            where: {
                guildId: guildId
            }, orderBy: [
                {
                    voiceLevel: 'desc'
                },
                {
                    voiceExperience: 'desc'
                }
            ], take: 999
        });
        return lb;
    }

    public async getTextRewards(guildId: string): Promise<RoleReward[]> {
        const rewards = await container.prisma.experience_role_rewards.findMany({
            where: { guildId }
        });
        return rewards.filter(reward => reward.roleType === 'text') as RoleReward[];
    }

    public async getVoiceRewards(guildId: string): Promise<RoleReward[]> {
        const rewards = await container.prisma.experience_role_rewards.findMany({
            where: { guildId }
        });
        return rewards.filter(reward => reward.roleType === 'voice') as RoleReward[];
    }

    public async getVoiceRank(userId: string, guildId: string) {
        const users = await container.prisma.voice_experience.findMany({
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
        return userIndex !== -1 ? userIndex + 1 : undefined;
    }

    public async getTextRank(userId: string, guildId: string) {
        const users = await container.prisma.text_experience.findMany({
            where: { guildId },
            orderBy: [
                {
                    textLevel: 'desc'
                },
                {
                    textExperience: 'desc'
                }
            ]
        });
        const userIndex = users.findIndex(user => user.userId === userId);
        return userIndex !== -1 ? userIndex + 1 : undefined;
    }

    public async getVoiceUserInfo(userId: string, guildId: string) {
        return await container.prisma.voice_experience.findUnique({
            where: {
                guildId_userId: {
                    userId,
                    guildId,
                }
            }
        });
    }

    public async getTextUserInfo(userId: string, guildId: string) {
        return await container.prisma.text_experience.findUnique({
            where: {
                guildId_userId: {
                    userId,
                    guildId,
                }
            }
        });
    }
}