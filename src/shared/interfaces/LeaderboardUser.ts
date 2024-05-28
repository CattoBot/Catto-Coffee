interface LeaderboardUser {
    userId: string;
    voiceLevel?: number;
    voiceExperience?: number;
    textLevel?: number;
    textExperience?: number;
}

export type LeaderboardUserData = LeaderboardUser;