import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '@components/home-component/home-page.component';
import { RestaurantsResolver } from '@resolvers/restaurants.resolver';
import { SignUpPageComponent } from '@components/sign-up-page/sign-up-page.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sign-up',
        component: SignUpPageComponent
      },
    ]
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: ':restaurantName',
    resolve: { resolverResponse: RestaurantsResolver },
    component: HomePageComponent
  },
  { path: '**', pathMatch: 'full', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
