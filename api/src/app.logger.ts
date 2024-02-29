import { LoggerService } from '@nestjs/common';
import { appendFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { format as dateFormat } from 'date-fns';

export class GasLogger implements LoggerService {
    debugFilename = resolve('.database/logs/debug.log');
    errorFilename = resolve('.database/logs/error.log');

    constructor() {
        mkdirSync('.database/logs', { recursive: true });
    }

    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]) {
        console.log('I have caught a log from Nest App', message);
        appendFileSync(this.debugFilename, dateFormat(new Date(), 'yyyyMMdd HH:mm:ss') + " LOG: " + message + "\n");
    }

    /**
     * Write a 'fatal' level log.
     */
    fatal(message: any, ...optionalParams: any[]) {
        console.log('I have caught a fatal from Nest App', message);
        appendFileSync(this.errorFilename, "--------\n" + dateFormat(new Date(), 'yyyyMMdd HH:mm:ss') + " FATAL: " + message + "\n--------\n");
    }

    /**
     * Write an 'error' level log.
     */
    error(message: any, ...optionalParams: any[]) {
        console.log('I have caught an error from Nest App', message);
        appendFileSync(this.errorFilename, "--------\n" + dateFormat(new Date(), 'yyyyMMdd HH:mm:ss') + " ERROR: " + message + "\n--------\n");
    }

    /**
     * Write a 'warn' level log.
     */
    warn(message: any, ...optionalParams: any[]) {
        console.log('I have caught a warning from Nest App', message);
        appendFileSync(this.errorFilename, "--------\n" + dateFormat(new Date(), 'yyyyMMdd HH:mm:ss') + " WARN: " + message + "\n--------\n");
    }

    /**
     * Write a 'debug' level log.
     */
    debug?(message: any, ...optionalParams: any[]) {
        console.log('I have caught a debug from Nest App', message);
        appendFileSync(this.debugFilename, dateFormat(new Date(), 'yyyyMMdd HH:mm:ss') + " DEBUG: " + message + "\n--------\n");
    }

    /**
     * Write a 'verbose' level log.
     */
    verbose?(message: any, ...optionalParams: any[]) {
        console.log('VERBOSE: ' + message);
        appendFileSync(this.debugFilename, dateFormat(new Date(), 'yyyyMMdd HH:mm:ss') + "  " + message + "\n--------\n");
    }
}
