import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImageInput } from '@components/inputs/image-input/image-input.component';
import { WindowRefService } from '@services/window-ref.service';
import { AuthApiService } from '@services/apis';
import { CloudinaryService } from '@services/cloudinary.service';
import { CookiesService } from '@services/cookies.service';
import { SeoService } from '@services/seo.service';
import { CropDialog } from '@components/inputs/crop-dialog/crop.dialog';
import { MatIconModule } from '@angular/material/icon';
import { ApproveDialog } from '@components/inputs/approve-dialog/approve.dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ApiHttpInterceptor } from '@interceptors/api.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignUpPageComponent,
    SpinningLoaderComponent,
    ImageInput,
    CropDialog,
    ApproveDialog
  ],
  imports: [
    BrowserModule,
    CloudinaryModule.forRoot({ Cloudinary }, CLODUINARY_CONFIG),
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    WindowRefService,
    CloudinaryService,
    CookiesService,
    SeoService,
    AuthApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHttpInterceptor,
      deps: [CookiesService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
