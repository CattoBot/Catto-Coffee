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
    type: 'string' | 'integer' | 'user' | 'role' | 'mentionable' | 'boolean' | 'attachment',
    key:string,
    required:boolean,
    choices?:CattoStringChoiceObject[],
    min?:number,
    max?:number,
    autocomplete?:boolean
}

type CattoStringChoiceObject = {
    key:string,
    value:string
}

export {AllowedCommand, allowedCommands, CattoCommandObject, CattoSubcommandGroupObject, CattoSubcommandObject, CattoCommandOptionObject, CattoStringChoiceObject}