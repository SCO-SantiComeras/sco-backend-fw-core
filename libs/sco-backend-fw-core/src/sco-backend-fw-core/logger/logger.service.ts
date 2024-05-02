import { Injectable } from '@nestjs/common';
import { format, createLogger, Logger, transports } from 'winston';

@Injectable()
export class LoggerService {
    
    private loggerInfo: Logger;
    private loggerError: Logger;
    private loggerWarn: Logger;
    private loggerDebug: Logger;

    constructor(){
        this.createLoggers();
        this.replaceConsole();
    }

    createLoggers(){
        const textFormat = format.printf((log) => {
            return `${log.timestamp} - [${log.level.toUpperCase().charAt(0)}] ${log.message}`;
        })

        const dateFormat = format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        })

        this.loggerInfo = createLogger({
            level: 'info',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.Console()
            ]
        });

        this.loggerError = createLogger({
            level: 'error',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.Console()
            ]
        });

        this.loggerWarn = createLogger({
            level: 'warn',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.Console()
            ]
        });

        this.loggerDebug = createLogger({
            level: 'warn',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.Console()
            ]
        });
    }

    replaceConsole(){
        console.log = (message: any, params: any) => {
            if (params) {
                this.loggerInfo.info(message + " " + JSON.stringify(params));
            } else {
                this.loggerInfo.info(message);
            }
        }
        
        console.error = (message: any, params: any) => {
            if (params) {
                this.loggerError.error(message + " " + JSON.stringify(params));
            } else {
                this.loggerError.error(message);
            }
        }
        
        console.warn = (message: any, params: any) => {
            if (params) {
                this.loggerWarn.warn(message + " " + JSON.stringify(params));
            } else {
                this.loggerWarn.warn(message);
            }
        }

        console.debug = (message: any, params: any) => {
            if (params) {
                this.loggerDebug.debug(message + " " + JSON.stringify(params));
            } else {
                this.loggerDebug.debug(message);
            }
        }
    }

    log(message: string) {
        this.loggerInfo.info(message);
    }
    
    error(message: string) {
        this.loggerError.error(message);
    }
    
    warn(message: string) {
        this.loggerWarn.warn(message);
    }
    
    debug(message: string) {
        this.loggerDebug.warn(message);
    }
}