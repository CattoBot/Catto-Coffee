import '@sapphire/plugin-i18next/register';
import { Client } from "@core/client.core";
import { LoadConfigHelper } from "@lib/helpers/bot/client/load.helper";

async function main(): Promise<void> {
    await LoadConfigHelper.init(new Client());
}

main();
