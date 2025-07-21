import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Injectable()
export class TranslateMessageInterceptor implements HttpInterceptor {
  constructor(
    private translateMessagesService: TranslateMessagesService
    ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if(event.body && event.body.exito && event.body.responseMesagge){
            event.body.responseMesagge = this.translateMessagesService.translateKey('ALERTS.SUCCESSFUL_OPERATION');
          }
          else if(event.body && !event.body.exito && event.body.responseMesagge){
            event.body.responseMesagge = this.translateMessagesService.translateKey('ALERTS.FAILED_OPERATION');
          }
        }
      })
    );
  }
}
