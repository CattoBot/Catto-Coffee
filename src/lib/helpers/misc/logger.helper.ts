import pkg from 'signale';
import { CustomMethods } from 'logger';
import { LogTypeOptions } from '@shared/constants/utils/logs.constants';
import { LogType } from '@shared/enum/misc/logs.enum';
import { Config } from '@core/config';

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
