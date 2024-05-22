export type AvatarExtension = 'png' | 'webp' | 'jpg' | 'jpeg' | 'gif';

export interface UserInfo {
    userId: string;
    displayName?: string;
    username: string;
    displayAvatarURL: (options: { extension: AvatarExtension; size: 512 }) => string;
    textExperience?: number;
    level: number;
    experience?: number;
    rank?: string;
    totalhours?: number;
    totalMessages?: number;
    aboutMe?: string;
}