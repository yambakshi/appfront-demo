import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { CookiesService } from '../cookies.service';
import { COOKIES } from '../constants';
import { Router } from '@angular/router';
import { Restaurant } from '@models/restaurant';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private releaseFiles: { [key: string]: File } = {};
    private userSubject: BehaviorSubject<Restaurant>;
    private httpOptions: any = {
        headers: {},
        responseType: 'json'
    }

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

    signUp(restaurant: Restaurant): any {
        this.releaseFiles = {};
        const formData: FormData = this.objectToFormData(restaurant);
        Object.entries(this.releaseFiles).forEach(([filename, file]) => {
            formData.append(filename, file);
        })

        return this.http.put('/api/auth/sign-up', formData, this.httpOptions)
            .pipe(
                map((res: any) => {
                    if (res.success) {
                        this.setUser(res.user);
                        this.cookiesService.set(COOKIES.TOKEN_KEY, res.token);
                    }

                    return res;
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

    private objectToFormData(obj: any, form?: FormData, namespace?: string): FormData {
        var fd: FormData = form || new FormData();
        var formKey;

        for (var property in obj) {
            if (obj.hasOwnProperty(property) && (obj[property] !== null && obj[property] !== undefined)) {

                if (namespace) {
                    formKey = namespace + '[' + property + ']';
                } else {
                    formKey = property;
                }

                // if the property is an object, but not a File, use recursivity.
                if (typeof obj[property] === 'object' &&
                    !(obj[property] instanceof File) &&
                    !(obj[property] instanceof Date) &&
                    !(obj[property] instanceof moment)) {
                    fd = this.objectToFormData(obj[property], fd, formKey);
                } else if (obj[property] instanceof Date || obj[property] instanceof moment) {
                    fd.append(formKey, obj[property].toISOString());
                } else if ((obj[property] instanceof File)) {
                    const formKeyParts = formKey.replace(/(?:(\]\[)|(\])|(\[))/g, '.').split('.');
                    formKeyParts.splice(formKeyParts.length - 2, 2);
                    const newFormKey = formKeyParts.join('.');
                    this.releaseFiles[newFormKey] = obj[property];
                } else if (property !== 'dataUrl') {
                    // if it's a string
                    fd.append(formKey, obj[property]);
                }
            }
        }

        return fd;
    }
}