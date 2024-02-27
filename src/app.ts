import '@sapphire/plugin-i18next/register';
import { Client } from "@core/client.core";
import { LoadHelper as bot } from "@lib/helpers/bot/client/load.helper";

async function main(): Promise<void> {
    await bot.run(new Client());
}

main();
