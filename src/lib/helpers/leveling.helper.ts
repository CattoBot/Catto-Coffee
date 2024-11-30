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
        const key = `textLeaderboard:${guildId}`;
        const leaderboard = await container.redis.zrevrange(key, 0, -1, "WITHSCORES");
        const parsedLeaderboard = this.parseLeaderboard(leaderboard);
        return this.populateLeaderboardDetails(parsedLeaderboard, 'text');
    }

    public async getVoiceLeaderboard(guildId: string) {
        const key = `voiceLeaderboard:${guildId}`;
        const leaderboard = await container.redis.zrevrange(key, 0, -1, "WITHSCORES");
        const parsedLeaderboard = this.parseLeaderboard(leaderboard);
        return this.populateLeaderboardDetails(parsedLeaderboard, 'voice');
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
        const key = `voiceLeaderboard:${guildId}`;
        const rank = await container.redis.zrevrank(key, userId);
        return rank !== null ? rank + 1 : undefined;
    }

    public async getTextRank(userId: string, guildId: string) {
        const key = `textLeaderboard:${guildId}`;
        const rank = await container.redis.zrevrank(key, userId);
        return rank !== null ? rank + 1 : undefined;
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

    public async updateVoiceLeaderboard(guildId: string, userId: string, experience: number) {
        const key = `voiceLeaderboard:${guildId}`;
        await container.redis.zadd(key, experience, userId);
    }

    public async updateTextLeaderboard(guildId: string, userId: string, experience: number) {
        const key = `textLeaderboard:${guildId}`;
        await container.redis.zadd(key, experience, userId);
    }

    private parseLeaderboard(data: string[]) {
        const result = [];
        for (let i = 0; i < data.length; i += 2) {
            result.push({ userId: data[i], score: parseInt(data[i + 1], 10) });
        }
        return result;
    }

    private async populateLeaderboardDetails(
        leaderboard: { userId: string; score: number }[],
        type: 'text' | 'voice'
    ) {
        const userIds = leaderboard.map(entry => entry.userId);

        type UserDetail = {
            userId: string;
            textLevel?: number;
            textExperience?: number;
            totalMessages?: number;
            voiceLevel?: number;
            voiceExperience?: number;
            totalTimeInVoiceChannel?: number;
        };

        const userDetails: UserDetail[] = type === 'text'
            ? await container.prisma.text_experience.findMany({
                where: { userId: { in: userIds } },
                select: { userId: true, textLevel: true, textExperience: true, totalMessages: true },
            })
            : await container.prisma.voice_experience.findMany({
                where: { userId: { in: userIds } },
                select: { userId: true, voiceLevel: true, voiceExperience: true, totalTimeInVoiceChannel: true },
            });

        return leaderboard.map(entry => {
            const userDetail: UserDetail = userDetails.find(user => user.userId === entry.userId) ?? {
                userId: entry.userId,
            };

            return {
                userId: entry.userId,
                score: entry.score,
                ...(type === 'text'
                    ? {
                        textLevel: userDetail.textLevel ?? 0,
                        textExperience: userDetail.textExperience ?? 0,
                        totalMessages: userDetail.totalMessages ?? 0,
                    }
                    : {
                        voiceLevel: userDetail.voiceLevel ?? 0,
                        voiceExperience: userDetail.voiceExperience ?? 0,
                        totalTimeInVoiceChannel: userDetail.totalTimeInVoiceChannel ?? 0,
                    }),
            };
        });
    }
}
