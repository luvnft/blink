import pino from 'pino';

interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

const customLogger: Logger = {
  info: (message: string, ...args: any[]): void => {
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]): void => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]): void => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]): void => {
    console.debug(`[DEBUG] ${message}`, ...args);
  },
};

const pinoLogger: Logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
}) as Logger;

// Choose which logger to export based on environment or configuration
const useCustomLogger = process.env.USE_CUSTOM_LOGGER === 'true';

export const logger: Logger = useCustomLogger ? customLogger : pinoLogger;