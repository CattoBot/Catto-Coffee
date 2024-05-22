process.env.NODE_ENV ??= 'development';

import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-subcommands/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-scheduled-tasks/register';
import { setup } from '@skyra/env-utilities';
import * as colorette from 'colorette';
import { join } from 'path';
import { inspect } from 'util';
import { rootDir } from './constants';
import { Config } from '../config';

Config.refreshCommands === true && ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
setup({ path: join(rootDir, '.env') });
inspect.defaultOptions.depth = 1;
colorette.createColors({ useColor: true });
