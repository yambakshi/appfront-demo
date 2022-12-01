import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Restaurant } from '@models/restaurant';
import { RestaurantsApiService } from '@services/apis';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsResolver implements Resolve<Restaurant> {
  constructor(
    private restaurantApiService: RestaurantsApiService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Restaurant> {
    const { restaurantName } = route.params;
    return this.restaurantApiService.getRestaurant(restaurantName).pipe(catchError(err => {
      this.router.navigateByUrl('/404');
      return of(null);
    }));
  }
}