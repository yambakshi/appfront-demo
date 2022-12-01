import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '@services/apis';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeoService } from '@services/seo.service';

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
            password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]]
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
        await this.timeout(500);
        this.authApiService.login({
            email: this.signUpForm.controls.email.value,
            password: this.signUpForm.controls.password.value
        }).subscribe((res: { success: boolean, message: string, callingUrl: string }) => {
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