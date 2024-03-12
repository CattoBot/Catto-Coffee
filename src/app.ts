import '@sapphire/plugin-i18next/register';
import { Client } from "@core/client.core";
import { ClientRunHelper as bot } from "@lib/helpers/bot/client/client-run.helper";

async function main(): Promise<void> {
    await bot.run(new Client());
}

main();
