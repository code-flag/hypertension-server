
import dotEnv from "dotenv";
import winston, { createLogger, format, Logger, transports } from "winston";
import { LOG_META } from './config';

dotEnv.config();

/**
 * Logger instance singleton. A new logger will only be created if we pass
 * the `forceNew=true`
 */
let loggerInstance: Logger | null = null;

let logDirectory: string = "./logs";


export const logger = (logMeta: string = LOG_META, forceNew: boolean = false, timeFormat: string = ""): Logger => {

    // const logFormat = format.printf(({ timestamp, level, message }) => {
    //     return `${timestamp} ${level}: ${message}`;
    // });

    if (loggerInstance === null || forceNew) {
        try {
            loggerInstance = createLogger({
                defaultMeta: { service: logMeta },
                format: format.combine(
                    format.colorize(),
                    format.timestamp(),
                    format.json(),
                ),
                transports: [
                    new transports.File(
                        { filename: 'error.log', level: 'error', dirname: logDirectory }
                    ),
                    new transports.File(
                        { filename: 'combined.log', dirname: logDirectory }
                    ),
                ],
                exitOnError: false,
            })
        } catch (err: any) {
            console.error("Could not create logger instance", err.message)
        }
    }
    if (loggerInstance === null) {
        console.error("Logger instance could not be created");
        // return dummy logger instance
        return createLogger();
    } else {
        if (process.env.NODE_ENV !== 'production') {
            loggerInstance.add(new winston.transports.Console({
                format: winston.format.simple(),
            }));
        };
        return loggerInstance;
    }
}

export const HTTPpLogger = () => {

}
// alias  for logger quick usage
export const log = (): winston.Logger => logger()

export default logger;