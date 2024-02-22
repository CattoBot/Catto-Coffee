import { LogType } from "@shared/enum/misc/logs.enum";
import { SignaleOptions } from "@shared/interfaces/logs.interface";

export class LogTypeOptions {
    private options: Record<LogType, SignaleOptions>;
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
                color: 'green',
                label: 'start',
            },
        };
    }

    public getOptions(logType: LogType): SignaleOptions {
        return this.options[logType];
    }
}
