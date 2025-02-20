export type AllowedCommand =
	| 'voice bitrate'
	| 'voice claim'
	| 'voice ghost'
	| 'voice invite'
	| 'voice limit'
	| 'voice lock'
	| 'voice name'
	| 'voice permit'
	| 'voice reject'
	| 'voice reset'
	| 'voice transfer'
	| 'voice trust'
	| 'voice unghost'
	| 'voice unlock'
	| 'voice untrust';

export const allowedCommands: AllowedCommand[] = [
	'voice bitrate',
	'voice claim',
	'voice ghost',
	'voice invite',
	'voice limit',
	'voice lock',
	'voice name',
	'voice permit',
	'voice reject',
	'voice reset',
	'voice transfer',
	'voice trust',
	'voice unghost',
	'voice unlock',
	'voice untrust'
];
