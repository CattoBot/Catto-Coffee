import '@sapphire/plugin-subcommands/register';
import '@sapphire/plugin-i18next/register';
import { Client } from "@app/client";
import { ClientRunHelper as app } from "@lib/helpers/bot/client/client-run.helper";
const client = new Client();

async function main(): Promise<void> {
   return app.run(client);
}

main();

export { client as ApplicationClient };