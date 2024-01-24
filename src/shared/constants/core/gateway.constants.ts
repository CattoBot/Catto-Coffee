import { GatewayIntentBits, Partials } from "discord.js";

export class Gateway {
    public static Intents: number = Object.values(GatewayIntentBits).reduce((acc: number, value: number) => acc | value, 0);
    public static Partials: number = (Object.values(Partials).filter((value) => typeof value === "number") as number[]).reduce((acc, value) => acc | value, 0);
}


