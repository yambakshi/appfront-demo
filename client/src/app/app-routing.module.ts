import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '@components/home-component/home-page.component';
import { RestaurantsResolver } from '@resolvers/restaurants.resolver';
import { SignUpPageComponent } from './components/sign-up-page/sign-up-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        resolve: { resolverResponse: RestaurantsResolver },
        component: HomePageComponent
      },
      {
        path: 'sign-up',
        component: SignUpPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
