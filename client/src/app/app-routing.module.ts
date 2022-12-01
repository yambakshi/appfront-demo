import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '@components/home-component/home-page.component';
import { SignUpPageComponent } from './components/sign-up-page/sign-up-page.component';

const routes: Routes = [{
  path: '',
  component: HomePageComponent
},
{
  path: 'sign-up',
  component: SignUpPageComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
