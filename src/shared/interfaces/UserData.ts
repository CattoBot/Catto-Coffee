import { Image } from 'canvas';

interface UserData {
	userInfo: string;
	avatar: Image;
}

export type FetchUserData = UserData;
