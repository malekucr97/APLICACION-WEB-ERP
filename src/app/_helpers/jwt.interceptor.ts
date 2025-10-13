
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';
import { jwtDecode as jwt_decode } from 'jwt-decode';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private accountService: AccountService) { }

    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.accountService.userValue;
        const isLoggedIn = user && user.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        // Evitar ciclo infinito: excluir /users/refresh-token y /users/logout de la lógica de renovación
        const isRefreshTokenRequest = request.url.includes('/users/refresh-token');
        const isLogoutRequest = request.url.includes('/users/logout');

        // Flag para evitar múltiples llamadas simultáneas al refresh
        if (!this.refreshTokenInProgress) this.refreshTokenInProgress = false;
        if (!this.refreshTokenSubject) this.refreshTokenSubject = new BehaviorSubject<string | null>(null);

        const addAuthHeader = (req: HttpRequest<any>, token: string) => {
            return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        };

        if (isLoggedIn && isApiUrl && !isRefreshTokenRequest && !isLogoutRequest) {
            
            let tokenExpired = false;
            try {
                
                const decoded: any = jwt_decode(user.token);
                const now = Math.floor(Date.now() / 1000);

                if (decoded.exp && decoded.exp < now + 30) tokenExpired = true;
                
            } catch { tokenExpired = true; }

            if (tokenExpired) {
                if (!this.refreshTokenInProgress) {
                    this.refreshTokenInProgress = true;
                    return from(
                        this.accountService.refreshToken()).pipe(
                            switchMap((newToken: string) => {
                                this.refreshTokenInProgress = false;
                                this.refreshTokenSubject.next(newToken);
                                user.token = newToken;
                                this.accountService.loadUserAsObservable(user);
                                return next.handle(addAuthHeader(request, newToken));
                            }),
                            catchError(err => {
                                this.refreshTokenInProgress = false;
                                this.refreshTokenSubject.next(null);
                                this.accountService.logout().subscribe();
                                return throwError(() => err);
                            }));
                } else {
                    // Si ya hay un refresh en curso, esperar a que termine
                    return this.refreshTokenSubject.pipe(
                        filter(token => token != null),
                        take(1),
                        switchMap(token => next.handle(addAuthHeader(request, token!)))
                    );
                }
            } else { request = addAuthHeader(request, user.token); }
        }

        return next.handle(request).pipe(
            catchError((err: any) => {
                if (err instanceof HttpErrorResponse 
                        && err.status === 401 
                        && isLoggedIn 
                        && isApiUrl 
                        && !isRefreshTokenRequest 
                        && !isLogoutRequest) {
                    // Si se recibe 401 y no estamos en refresh-token o logout, intentar renovar una vez
                    return from(this.accountService.refreshToken()).pipe(
                        switchMap((newToken: string) => {
                            this.refreshTokenSubject.next(newToken);
                            user.token = newToken;
                            this.accountService.loadUserAsObservable(user);
                            return next.handle(addAuthHeader(request, newToken));
                        }),
                        catchError(error => {
                            this.accountService.logout().subscribe();
                            return throwError(() => error);
                        })
                    );
                }
                return throwError(() => err);
            })
        );
    }
}