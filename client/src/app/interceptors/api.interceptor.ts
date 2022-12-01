import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "@environments/environment";
import { CookiesService } from '@services/cookies.service';
import { COOKIES } from '@services/constants';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class ApiHttpInterceptor implements HttpInterceptor {
    constructor(private cookiesStorageService: CookiesService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let isAbsoluteUrl = this.isAbsoluteUrl(request.url);
        if (isAbsoluteUrl) {
            return next.handle(request);
        }

        let token = this.cookiesStorageService.get(COOKIES.TOKEN_KEY);
        if (token) {
            const tokenParts = token.split('"');
            if (tokenParts.length > 1)
                token = tokenParts[1];
        }

        const url = `${environment.apiUrl}${request.url}`;
        const headers = {
            Authorization: `bearer ${token}`
        };

        const modified = request.clone({ setHeaders: headers, url: url });
        return next.handle(modified);
    }

    private isAbsoluteUrl(url: string): boolean {
        return url.startsWith('http');
    }
}