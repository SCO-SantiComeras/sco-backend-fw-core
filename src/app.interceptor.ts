import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppService } from './app.service';

@Injectable()
export class AppInterceptor implements NestInterceptor {

  /* Add App dependencies inyection to context */
  constructor(private readonly appService: AppService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    /* Set Function Files Constants Header */
    context.switchToHttp().getRequest().headers['FUNCTION_FILES'] = this.appService.getFuntionFilesConstants();

    /* Set Providers Header */
    context.switchToHttp().getRequest().headers['providers'] = this.appService;

    /* Set Validation Passport Callback */
    context.switchToHttp().getRequest().headers['validationPassport'] = this.appService.validationPassportCallback.bind(this.appService);

    /* Set Types */
    context.switchToHttp().getRequest().headers['types'] = this.appService.getTypesConstants();
    
    return next.handle().pipe(
      tap(() => {
        /* After Interceptor Code Here... */
      }),
    );
  }
}