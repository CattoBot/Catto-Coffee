import pkg from 'signale';
import { CustomMethods } from 'logger';
import { LogTypeOptions } from '@shared/constants/utils/logs.constants';
import { LogType } from '@shared/enum/misc/logs.enum';

export class ServerLogger extends pkg.Signale<CustomMethods> {
    private static instance: ServerLogger | null = null;
    private constructor() {
        const options = {} as Record<CustomMethods, pkg.CommandType>;
        for (const key of Object.keys(LogTypeOptions)) {
            options[key as CustomMethods] = LogTypeOptions[key as LogType];
        }

        super({
            types: options,
        });
    }

    public static getInstance(): ServerLogger {
        if (!ServerLogger.instance) {
            ServerLogger.instance = new ServerLogger();
        }
        return ServerLogger.instance;
    }
}
