import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Restaurant } from '@models/restaurant';

@Injectable({
    providedIn: 'root'
})
export class RestaurantsApiService {
    private restaurantSubject: BehaviorSubject<Restaurant>;
    private httpOptions: any = {
        headers: {},
        responseType: 'json'
    }

    constructor(
        private http: HttpClient) {
        this.restaurantSubject = new BehaviorSubject<Restaurant>(null);
    }

    getRestaurantObservable(): Observable<Restaurant> {
        return this.restaurantSubject.asObservable();
    }

    setRestaurant(restaurant: Restaurant): void {
        this.restaurantSubject.next(restaurant);
    }

    getRestaurant(restaurantName: string): any {
        return this.http.get(`/api/restaurant/${restaurantName}`, this.httpOptions)
            .pipe(
                map((res: any) => {
                    this.setRestaurant(res);
                    return res;
                }),
                catchError(this.handleError));
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
        return throwError('Something bad happened; please try again later.');
    }
}