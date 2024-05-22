import pkg from 'signale';
import { ConsoleLogger } from './classes/Logger';
import { LogType } from '../shared/enum/LogType';
import { CustomMethods } from '../shared/types/CustomLogMethods';

export class ApplicationConsole extends pkg.Signale<CustomMethods> {
    constructor() {
        const logger = new ConsoleLogger();
        const options = {} as Record<CustomMethods, pkg.CommandType>;
        for (const key in LogType) {
            const logType = LogType[key as keyof typeof LogType] as LogType;
            const option = logger.getOptions(logType);

            options[key as CustomMethods] = {
                badge: option.badge,
                color: option.color,
                label: option.label,
                logLevel: "debug"
            };
        }

        super({
            interactive: false,
            scope: 'Bot',
            types: options,
        });
    }
}
