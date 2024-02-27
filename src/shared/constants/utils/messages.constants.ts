export class Messages {
    public static Success = {
        BotReady: (name: string) => `${name} is ready to rumble.`,
        DatabaseSuccess: (ping?: string) => `Successfully connected to \x1b[36mMySQL\x1b[0m database ${ping}ms.`,
        RedisDatabaseSuccess: (ping?: string) => `Successfully connected to \x1b[31mRedis\x1b[0m database ${ping}ms.`,
        ClientSuccess: (client: string) => `Successfully connected to \x1b[33mDiscord Gateway\x1b[0m with ${client}.`
    };

    public static Errors = {
        MissingToken: 'Token is not defined in the environment variables.',
        BotClientError: 'Something went wrong fetching the Discord Gateway.',
        DatabaseError: 'Something went wrong fetching the database.',
        RedisError: 'Something went wrong fetching the \x1b[31mRedis\x1b[0m database.'
    };
}