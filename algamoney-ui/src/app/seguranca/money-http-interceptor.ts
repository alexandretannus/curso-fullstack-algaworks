import {mergeMap} from 'rxjs/internal/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from 'src/app/seguranca/auth.service';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export class NotAuthenticatedError {

}

@Injectable()
export class MoneyHttpInterceptor implements HttpInterceptor{

    constructor(private auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      if (!req.url.includes('/oauth/token') && this.auth.isAccessTokenInvalido()) {

      return from(this.auth.obterNovoAccessToken())
          .pipe(
              mergeMap(() => {
                  if (this.auth.isAccessTokenInvalido) {
                    throw new NotAuthenticatedError();
                  }
                  req = req.clone({
                      setHeaders: {
                          Authorization: `Bearer ${localStorage.getItem('token')}`
                      }
                  });
                  return next.handle(req);
              })
          );
      }

      return next.handle(req);
  }
}
