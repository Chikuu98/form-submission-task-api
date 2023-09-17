import { createLogger, transports, format } from 'winston';

export class logger {

     public static log(type: any, message: any, trace: any) {
          {
               const logger = createLogger({
                    transports: [
                         new transports.File({
                              filename: 'log/' + new Date().toISOString().split('T')[0] + '/.log',
                              format: format.combine(
                                   format.timestamp(),
                                   format.json(),
                                   format.prettyPrint()
                              )
                         }),
                         new transports.File({
                              level: 'error',
                              filename: 'log/' + new Date().toISOString().split('T')[0] + '/error.log',
                              format: format.combine(
                                   format.timestamp(),
                                   format.json(),
                                   format.prettyPrint(),
                              )
                         })
                    ]
                    ,
               }
               );
               
               logger.log(type, message, trace)
          }
     }
}
