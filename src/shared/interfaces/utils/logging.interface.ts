import { Client } from "@app/client";

export interface Logging {
    /**
     * Log the bot connections
     * @param client 
     */
    Bot(client: Client): void;

    /**
     * Log the Prisma connection
     */
    Prisma(): void;

    /**
     * Log the Redis connection
     */
    Redis(): void;
}