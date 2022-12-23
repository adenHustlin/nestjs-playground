import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const { user, method, route } = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    // const className = context.getClass().name;
    // const handler = context.getHandler().name;
    const param =
      Object.keys(context.switchToHttp().getRequest().params).length !== 0
        ? JSON.stringify(context.switchToHttp().getRequest().params)
        : '';

    const query =
      Object.keys(context.switchToHttp().getRequest().query).length !== 0
        ? JSON.stringify(context.switchToHttp().getRequest().query)
        : '';

    return next.handle().pipe(
      tap((value) => {
        const delay = Date.now() - now;
        this.logger.log(
          `${method} ${param} ${query} ${route.path} has been executed - ${delay}ms`,
        );
      }),
      catchError((error) => {
        const delay = Date.now() - now;
        this.logger.error(
          ` ${method} ${param} ${query} ${route.path} has been executed  returned with status ${error.status}  - ${delay}ms`,
        );
        return throwError(error);
      }),
    );
    // .pipe(
    //   tap(() =>
    //     this.logger.log(
    //       ` ${method} ${param} ${query} ${route.path} has been executed returned with code ${statusCode}`,
    //     ),
    //   ),
    // );
  }
}
