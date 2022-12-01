import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '@services/apis';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeoService } from '@services/seo.service';
import { ImageInputConfig } from '@models/form-utils';
import { ThemePalette } from '@angular/material/core';
import { Color } from '@angular-material-components/color-picker';
import { ApiResponse } from '@models/responses';

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
    disabled = false;
    color: ThemePalette = 'primary';
    touchUi = false;
    hexRegex: RegExp = /#\b[0-9A-F]{6}\b/;
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
        this.seoService.setTags('Sign Up');
    }

    ngOnInit(): void {
        const defaultBrandColor = new Color(255, 255, 255);
        this.signUpForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]],
            name: ['', [Validators.required, Validators.maxLength(80)]],
            pointOfSale: ['', [Validators.required]],
            brandColors: this.formBuilder.array(Array(3).fill(
                this.formBuilder.control(defaultBrandColor, this.invalidHex()))
            ),
            image: ['', [Validators.required]],
        });
    }

    get f() { return this.signUpForm.controls; }

    get brandColors(): FormArray {
        return this.signUpForm.get('brandColors') as FormArray;
    }

    invalidHex(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value === null) return null;

            const invalidHex = control.value.hex.match(this.hexRegex);
            return invalidHex ? { invalidHex: { value: control.value } } : null;
        };
    }

    resolved(captchaResponse: string) {
        console.log(`Resolved captcha with response: ${captchaResponse}`);
    }

    async onSubmit() {
        this.submitted = true;
        if (this.signUpForm.invalid || this.authError) {
            return;
        }

        this.showLoader = true;

        const restaurant = this.signUpForm.value;
        this.authApiService.signUp(restaurant).subscribe((res: ApiResponse) => {
            if (res.success) {
                this.router.navigateByUrl(`/${res.data.name}`);
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