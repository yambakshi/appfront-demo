import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { COOKIES } from './constants';


@Injectable({
    providedIn: 'root'
})
export class CookiesService {
    constructor(private cookieService: CookieService) { }

    set(key: string, value: any, expires?: number | Date) {
        if (typeof value == 'object')
            value = JSON.stringify(value);

        if (!expires) {
            expires = new Date();
            expires.setFullYear(expires.getFullYear() + 10);
        }

        this.cookieService.set(this.getKey(key), value, expires, '/');
    }

    get(key: string): any {
        let val = this.cookieService.get(this.getKey(key));
        try {
            val = JSON.parse(val);
        } catch (err) { }

        return val;
    }

    remove(key: string, path: string = '/', domain?: string) {
        this.cookieService.delete(this.getKey(key), path, domain);
    }

    private getKey(key): string {
        return `${COOKIES.PREFIX}${key}`;
    }
}