import winston from 'winston';
import { WinstonModule } from 'nest-winston';

export const WinstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        winston.format.printf((info) => {
          return `${info.timestamp} ${info.level.toUpperCase()} ${
            info.message
          } `;
        }),
        winston.format.colorize({ all: true }),
      ),
    }),
  ],
});
