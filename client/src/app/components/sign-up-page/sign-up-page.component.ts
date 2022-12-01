import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '@services/apis';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeoService } from '@services/seo.service';
import { ImageInputConfig } from '@models/form-utils';
import { Restaurant } from '@models/restaurant';

@Component({
    selector: 'sign-up-page',
    templateUrl: './sign-up-page.component.html',
    styleUrls: [
        './sign-up-page.component.common.scss',
        './sign-up-page.component.mobile.scss'
    ]
})
export class SignUpPageComponent implements OnInit {
    signUpForm: FormGroup;
    submitted: boolean = false;
    authError: string = '';
    passwordMinLength: number = 6;
    showLoader: boolean = false;
    imageInputsConfigs: { [key: string]: ImageInputConfig } = {
        image: {
            label: 'Upload Image',
            recommended: { width: 3000, height: 3000 },
            ratio: { width: 1, height: 1 },
            required: true,
            ratioErrorCropEnabled: true
        }
    };

    constructor(
        private seoService: SeoService,
        private authApiService: AuthApiService,
        private formBuilder: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar) {
        this.seoService.setTags('Login');
    }

    ngOnInit(): void {
        this.signUpForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]],
            name: ['', [Validators.required, Validators.maxLength(80)]],
            // pointOfSale: ['', [Validators.required]],
            // brandColors: ['', [Validators.required]],
            image: ['', [Validators.required]],
        });
    }

    get f() { return this.signUpForm.controls; }

    timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async onSubmit() {
        this.submitted = true;
        if (this.signUpForm.invalid || this.authError) {
            return;
        }

        this.showLoader = true;

        const restaurant = this.signUpForm.value;
        this.authApiService.signUp(restaurant).subscribe((res: { success: boolean, message: string, callingUrl: string }) => {
            if (res.success) {
                this.router.navigateByUrl(res.callingUrl);
            } else {
                this.showLoader = false;
                this.showSnackBar(res);
            }
        }, err => {
            this.showLoader = false;
            this.authError = err;
        });
    }

    showSnackBar({ message }) {
        const config = {
            duration: 5000,
            panelClass: ['custom-snackbar', 'fail-snackbar']
        }

        this.snackBar.open(message, 'Dismiss', config);
    }
}