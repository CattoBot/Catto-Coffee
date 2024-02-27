import { Client } from "@core/client.core";

export interface ICore {
    InitBot(client: Client): void;
    InitMySQL(): void;
    InitRedis(): void;
}