declare module '@sapphire/framework' {
    interface Preconditions {
        GuildExistsPrecondition: never;
        GuildBlacklistPrecondition: never;
        UserBlacklistPrecondition: never;
        GuildUserBlacklistPrecondition: never;
        ChannelOwnerPrecondition: never;
        ChannelClaimPrecondition: never;
        RolePermitCommandPrecondition: never;
    }
}

export default undefined;