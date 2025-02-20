type RoleReward = {
	id: number;
	guildId: string;
	roleId: string;
	level: number;
	roleType: 'text' | 'voice';
};

type VoiceXP = {
	guildId: string;
	isEnabled: boolean;
};

type TextXP = {
	guildId: string;
	isEnabled: boolean;
};

export { RoleReward, VoiceXP, TextXP };
