import '@sapphire/plugin-i18next/register';
import { Client } from "@core/client.main";
import { LoadConfigHelper } from "@lib/helpers/client/load.helper";
import { I18nConfig } from '@shared/constants/core/i18n';

async function main(): Promise<void> {
    await LoadConfigHelper.init(new Client(I18nConfig));
}

main();
