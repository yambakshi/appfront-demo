import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { CookiesService } from '../cookies.service';
import { COOKIES } from '../constants';
import { Router } from '@angular/router';
import { Restaurant } from '@models/restaurant';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private userSubject: BehaviorSubject<Restaurant>;
    private httpOptions: any = {
        headers: {},
        responseType: 'json'
    }
    private callingUrl: string;

    constructor(
        private http: HttpClient,
        private cookiesService: CookiesService,
        private router: Router) {
        this.userSubject = new BehaviorSubject<Restaurant>(null);
    }

    getUserObservable(): Observable<Restaurant> {
        return this.userSubject.asObservable();
    }

    setUser(user: Restaurant): void {
        this.userSubject.next(user);
    }

    setCallingUrl(callingUrl: string): void {
        this.callingUrl = callingUrl;
    }

    logout(): any {
        return this.http.post('/api/auth/logout', {}, this.httpOptions)
            .pipe(
                map(res => res),
                finalize(() => {
                    this.router.navigate(['']);
                    this.setUser(null);
                }),
                catchError(this.handleError)).subscribe(res => {
                    this.cookiesService.remove(COOKIES.TOKEN_KEY);
                });
    }

    login(creds: { email: string, password: string }): any {
        return this.http.post('/api/auth/login', creds, this.httpOptions)
            .pipe(
                map((res: any) => {
                    const callingUrl = this.callingUrl || '/admin';
                    if (res.success) {
                        this.setUser(res.user);
                        this.cookiesService.set(COOKIES.TOKEN_KEY, res.token);
                        this.callingUrl = null;
                    }

                    return { ...res, callingUrl };
                }),
                catchError(this.handleError));
    }

    changePassword(password: string): any {
        return this.http.post('/api/auth/change-password', { password }, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof HttpErrorResponse) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened; please try again later.');
    }
}