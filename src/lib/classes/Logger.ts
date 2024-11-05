import { LOGTYPE } from "../enum";
import ConsoleOptions from "../types/consoleOptions";

export class ConsoleLogger {
    private options: Record<LOGTYPE, ConsoleOptions>;
    constructor() {
        this.options = {
            [LOGTYPE.INFO]: {
                badge: 'ℹ',
                color: 'blue',
                label: 'info',
            },
            [LOGTYPE.WARN]: {
                badge: '⚠',
                color: 'yellow',
                label: 'warn',
            },
            [LOGTYPE.ERROR]: {
                badge: '✖',
                color: 'red',
                label: 'error',
            },
            [LOGTYPE.DEBUG]: {
                badge: '🐛',
                color: 'magenta',
                label: 'debug',
            },
            [LOGTYPE.SUCCESS]: {
                badge: '✔',
                color: 'green',
                label: 'success',
            },
            [LOGTYPE.LOG]: {
                badge: '📝',
                color: 'white',
                label: 'log',
            },
            [LOGTYPE.PAUSE]: {
                badge: '⏸',
                color: 'yellow',
                label: 'pause',
            },
            [LOGTYPE.START]: {
                badge: '▶',
                color: 'magenta',
                label: 'start',
            },
        };
    }

    public getOptions(logType: LOGTYPE): ConsoleOptions {
        return this.options[logType];
    }
}
