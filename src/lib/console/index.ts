import pkg from 'signale';
import { ConsoleLogger } from '../classes/logger';
import { LOGTYPE } from '../enum';
import CustomMethods from '../types/customLogMethods';

export default class ApplicationConsole extends pkg.Signale<CustomMethods> {
    constructor() {
        const logger = new ConsoleLogger();
        const options = {} as Record<CustomMethods, pkg.CommandType>;
        for (const key in LOGTYPE) {
            const logType = LOGTYPE[key as keyof typeof LOGTYPE] as LOGTYPE;
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
