import pkg from 'signale';
import { CustomMethods } from '@shared/types/logger';
import { LogTypeOptions } from '@shared/constants/logs.constants';
import { LogType } from '@shared/enum/misc/logs.enum';
import { Config } from '@app/config';

export class ServerLogger extends pkg.Signale<CustomMethods> {
    constructor() {
        const options = {} as Record<CustomMethods, pkg.CommandType>;
        for (const key of Object.keys(LogTypeOptions)) {
            options[key as CustomMethods] = LogTypeOptions[key as LogType];
        }

        super({
            interactive: Config.Logs.InteractiveLogs,
            scope: Config.Logs.Scope,
            types: options,
        });
    }
}

export const logger = new ServerLogger();