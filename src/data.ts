import dotenv from "dotenv";

dotenv.config();

export class Data {
    private static readonly instance = new Data();
    private readonly botToken: string;
    private readonly botOwners: string[];
    private readonly botPrefix: string;

    private constructor() {
        const { BOT_TOKEN, BOT_OWNERS, BOT_PREFIX } = process.env;

        if (!BOT_TOKEN) {
            throw new Error("Bot token is not defined in the environment variables.");
        }

        this.botToken = BOT_TOKEN;
        this.botPrefix = BOT_PREFIX;
        this.botOwners = BOT_OWNERS?.split(",") || [];
    }

    public static getInstance(): Data {
        return Data.instance;
    }

    get Token(): string {
        return this.botToken;
    }

    get Owners(): string[] {
        return this.botOwners;
    }

    get Prefix(): string {
        return this.botPrefix;
    }
}