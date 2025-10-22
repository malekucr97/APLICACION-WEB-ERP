
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private router: Router, private accountService: AccountService) { }

    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.accountService.userValue;
        const isLoggedIn = !!user?.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        const isRefreshTokenRequest = request.url.includes('/users/refresh-token');
        const isLogoutRequest = request.url.includes('/users/logout');

        // Inicializa los flags si no existen
        this.refreshTokenInProgress ??= false;
        this.refreshTokenSubject ??= new BehaviorSubject<string | null>(null);

        const addAuthHeader = (req: HttpRequest<any>, token: string) =>
            req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

        // No interceptar refresh ni logout
        if (isRefreshTokenRequest || isLogoutRequest) return next.handle(request);
        

        // Si el usuario tiene token y es una URL de la API
        if (isLoggedIn && isApiUrl) {

            let tokenExpired = false;

            try {
                const decoded: any = jwt_decode(user.token);
                const now = Math.floor(Date.now() / 1000);
                if (decoded.exp && decoded.exp < now) tokenExpired = true;

            } catch { tokenExpired = true; }

            if (tokenExpired) {
                if (!this.refreshTokenInProgress) {

                    this.refreshTokenInProgress = true;

                    return this.accountService.refreshToken().pipe(
                        switchMap((newToken: string) => {
                            this.refreshTokenInProgress = false;
                            this.refreshTokenSubject.next(newToken);

                            // Actualiza el usuario en memoria
                            user.token = newToken;
                            this.accountService.loadUserAsObservable(user);

                            return next.handle(addAuthHeader(request, newToken));
                        }),
                        catchError(err => {
                            this.refreshTokenInProgress = false;
                            this.refreshTokenSubject.next(null);

                            console.log(`JWT Interceptor Error: ${err.error?.message}. Logout Session.`);
                            this.accountService.clearSession();
                            this.router.navigate(['account/login']);

                            return throwError(() => err);
                        })
                    );
                } else {
                    // Esperar a que termine el refresh en curso
                    return this.refreshTokenSubject.pipe(
                        filter(token => token != null),
                        take(1),
                        switchMap(token => next.handle(addAuthHeader(request, token!)))
                    );
                }
            }

            // Token válido → añadir header normal
            request = addAuthHeader(request, user.token);
        }

        return next.handle(request).pipe(
            catchError((err: any) => {

                // const message = err?.error?.message ?? err?.message ?? err.toString();

                // Si el token expiró o fue inválido
                if (err.status === 401 && !isRefreshTokenRequest) {

                // Intentar refrescar token una vez
                if (!this.refreshTokenInProgress) {

                    this.refreshTokenInProgress = true;

                    return this.accountService.refreshToken().pipe(
                        switchMap((res: any) => {
                            const newToken = res?.token;
                            if (!newToken) throw new Error('Refresh token no devolvió un token válido.');

                            this.refreshTokenInProgress = false;
                            this.refreshTokenSubject.next(newToken);

                            user.token = newToken;
                            this.accountService.loadUserAsObservable(user);

                            // Reintenta el request original
                            return next.handle(request.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
                        }),
                        catchError(refreshErr => {
                            this.refreshTokenInProgress = false;
                            this.refreshTokenSubject.next(null);

                            console.log(`JWT Interceptor RefreshError: ${refreshErr.error?.message}. Logout Session.`);
                            this.accountService.clearSession();
                            this.router.navigate(['account/login']);

                            return throwError(() => refreshErr);
                        })
                    );

                    } else {
                        // Si ya hay un refresh en curso, esperar
                        return this.refreshTokenSubject.pipe(
                            filter(token => token != null),
                            take(1),
                            switchMap(token => next.handle(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })))
                        );
                    }
                }
                return throwError(() => err);
            })
        );




        // return next.handle(request).pipe(
        //     catchError((err: any) => {
        //     const message = err?.error?.message ?? err?.message ?? err.toString();

        //     if (message === "Invalid refresh token" || message === "Expired or revoked refresh token") {
        //         console.log(`Error detectado por el interceptor: ${message}, se cierra sesión.`);
        //         this.accountService.clearSession(); // sin llamada HTTP
        //     }

        //     return throwError(() => err);
        //     })
        // );
    }






    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     const user = this.accountService.userValue;
    //     const isLoggedIn = user && user.token;
    //     const isApiUrl = request.url.startsWith(environment.apiUrl);

    //     // Evitar ciclo infinito: excluir /users/refresh-token y /users/logout de la lógica de renovación
    //     const isRefreshTokenRequest = request.url.includes('/users/refresh-token');
    //     const isLogoutRequest = request.url.includes('/users/logout');

    //     // Flag para evitar múltiples llamadas simultáneas al refresh
    //     if (!this.refreshTokenInProgress) this.refreshTokenInProgress = false;
    //     if (!this.refreshTokenSubject) this.refreshTokenSubject = new BehaviorSubject<string | null>(null);

    //     const addAuthHeader = (req: HttpRequest<any>, token: string) => {
    //         return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    //     };

    //     if (isLoggedIn && isApiUrl && !isRefreshTokenRequest && !isLogoutRequest) {
            
    //         let tokenExpired = false;
    //         try {
                
    //             const decoded: any = jwt_decode(user.token);
    //             const now = Math.floor(Date.now() / 1000);

    //             if (decoded.exp && decoded.exp < now + 30) tokenExpired = true;
                
    //         } catch { tokenExpired = true; }

    //         if (tokenExpired) {
    //             if (!this.refreshTokenInProgress) {
    //                 this.refreshTokenInProgress = true;
    //                 return from(
    //                     this.accountService.refreshToken()).pipe(
    //                         switchMap((newToken: string) => {
    //                             this.refreshTokenInProgress = false;
    //                             this.refreshTokenSubject.next(newToken);
    //                             user.token = newToken;
    //                             this.accountService.loadUserAsObservable(user);
    //                             return next.handle(addAuthHeader(request, newToken));
    //                         }),
    //                         catchError(err => {
    //                             this.refreshTokenInProgress = false;
    //                             this.refreshTokenSubject.next(null);
    //                             this.accountService.logout().subscribe();
    //                             return throwError(() => err);
    //                         }));
    //             } else {
    //                 // Si ya hay un refresh en curso, esperar a que termine
    //                 return this.refreshTokenSubject.pipe(
    //                     filter(token => token != null),
    //                     take(1),
    //                     switchMap(token => next.handle(addAuthHeader(request, token!)))
    //                 );
    //             }
    //         } else { request = addAuthHeader(request, user.token); }
    //     }

    //     return next.handle(request).pipe(
    //         catchError((err: any) => {

    //             let msjError : string = err.toString();

    //             if (msjError === "Invalid refresh token" || msjError === "Expired or revoked refresh token") {
                    
    //                 console.log(`Error detectado por el interceptor:, ${msjError}, se cierra sesión.`);
    //                 this.accountService.logout().subscribe();
    //             }
    //             return throwError(() => err);
    //         })
    //     );
    // }
}