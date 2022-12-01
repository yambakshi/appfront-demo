import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignUpPageComponent } from '@components/sign-up-page/sign-up-page.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { CLODUINARY_CONFIG } from '@services/constants';
import { HomePageComponent } from '@components/home-component/home-page.component';
import { SpinningLoaderComponent } from '@components/spinning-loader/spinning-loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignUpPageComponent,
    SpinningLoaderComponent
  ],
  imports: [
    BrowserModule,
    CloudinaryModule.forRoot({ Cloudinary }, CLODUINARY_CONFIG),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
