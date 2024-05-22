import { LogType } from "../../shared/enum/LogType";
import { ConsoleOptions } from "../../shared/types/ConsoleOptions";

export class ConsoleLogger {
    private options: Record<LogType, ConsoleOptions>;
    constructor() {
        this.options = {
            [LogType.INFO]: {
                badge: 'ℹ',
                color: 'blue',
                label: 'info',
            },
            [LogType.WARN]: {
                badge: '⚠',
                color: 'yellow',
                label: 'warn',
            },
            [LogType.ERROR]: {
                badge: '✖',
                color: 'red',
                label: 'error',
            },
            [LogType.DEBUG]: {
                badge: '🐛',
                color: 'magenta',
                label: 'debug',
            },
            [LogType.SUCCESS]: {
                badge: '✔',
                color: 'green',
                label: 'success',
            },
            [LogType.LOG]: {
                badge: '📝',
                color: 'white',
                label: 'log',
            },
            [LogType.PAUSE]: {
                badge: '⏸',
                color: 'yellow',
                label: 'pause',
            },
            [LogType.START]: {
                badge: '▶',
                color: 'magenta',
                label: 'start',
            },
        };
    }

    public getOptions(logType: LogType): ConsoleOptions {
        return this.options[logType];
    }
}
