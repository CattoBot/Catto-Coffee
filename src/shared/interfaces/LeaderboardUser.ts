interface LeaderboardUser {
	userId: string;
	voiceLevel?: number;
	voiceExperience?: number;
	totalTimeInVoiceChannel?: number;
	textLevel?: number;
	textExperience?: number;
	totalMessages?: number;
	dailyTimeInVoiceChannel?: number;
	weeklyTimeInVoiceChannel?: number;
	monthlyTimeInVoiceChannel?: number;
	totalMessagesDaily?: number;
	totalMessagesWeekly?: number;
	totalMessagesMonthly?: number;
}

export type LeaderboardUserData = LeaderboardUser;
