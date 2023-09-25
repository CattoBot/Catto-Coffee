import dotenv from "dotenv";

dotenv.config();

export class BotData {
    private static readonly instance = new BotData();
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

    public static getInstance(): BotData {
        return BotData.instance;
    }

    get getToken(): string {
        return this.botToken;
    }

    get getOwners(): string[] {
        return this.botOwners;
    }

    get getPrefix(): string {
        return this.botPrefix;
    }
}