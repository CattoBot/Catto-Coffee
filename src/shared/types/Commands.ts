type AllowedCommand = 
    'voice bitrate' |
    'voice claim' |
    'voice ghost' |
    'voice invite' |
    'voice limit' |
    'voice lock' |
    'voice name' |
    'voice permit' |
    'voice reject' |
    'voice reset' |
    'voice transfer' |
    'voice trust' |
    'voice unghost' |
    'voice unlock' |
    'voice untrust';

const allowedCommands: AllowedCommand[] = [
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
    'voice untrust',
];

type CattoCommandObject = {
    key: string,
    subcommands?: CattoSubcommandObject[],
    subcommandgroups?: CattoSubcommandGroupObject[],
    options?: CattoCommandOptionObject[];
}

type CattoSubcommandGroupObject = {
    key: string,
    subcommands: CattoSubcommandObject[],
}

type CattoSubcommandObject = {
    key: string,
    options?: CattoCommandOptionObject[];
}

type CattoCommandOptionObject = {
    type: 'string' | 'integer' | 'user' | 'role' | 'mentionable' | 'boolean' | 'attachment' | 'channel',
    key:string,
    required:boolean,
    choices?:CattoStringChoiceObject[],
    min?:number,
    max?:number,
    autocomplete?:boolean,
    channel_types?:DiscordChannelArray[] | DiscordChannelArrayCode[]
}

type DiscordChannelArrayCode = [ 1,2,3,4,5,6,7,8,9,10,11,12 ]
type DiscordChannelArray = [
    "GUILD_TEXT",
    "DM",
    "GUILD_VOICE",
    "GROUP_DM",
    "GUILD_CATEGORY",
    "GUILD_ANNOUNCEMENT",
    "ANNOUNCEMENT_THREAD",
    "PUBLIC_THREAD",
    "PRIVATE_THREAD",
    "GUILD_DIRECTORY",
    "GUILD_FORUM",
    "GUILD_MEDIA"
]


type CattoStringChoiceObject = {
    key:string,
    value:string
}

export {AllowedCommand, allowedCommands, CattoCommandObject, CattoSubcommandGroupObject, CattoSubcommandObject, CattoCommandOptionObject, CattoStringChoiceObject}