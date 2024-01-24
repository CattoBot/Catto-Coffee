import pkg from 'signale';
const { Signale } = pkg;
import { CustomMethods } from 'logger';
import { LogTypeOptions } from '../../shared/constants/utils/logs.constants';

export class ServerLogger extends Signale<CustomMethods> {
    constructor() {
        super(),
        {
            types: LogTypeOptions
        };
    }
}