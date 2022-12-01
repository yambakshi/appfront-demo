import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CropArea } from '@models/graphics';
import Cropper from 'cropperjs';


export interface DialogData {
    editMode: boolean;
    imgSrc: string;
    ratio: { width: number, height: number };
    cropArea: CropArea;
    isMobile: boolean;
}

@Component({
    selector: 'crop-dialog',
    templateUrl: 'crop.dialog.html',
    styleUrls: [
        './crop.dialog.common.scss',
        './crop.dialog.mobile.scss'
    ]
})
export class CropDialog implements OnInit, AfterViewInit {
    readonly maxCropBoxSize = { desktop: 500, mobile: 300 };
    @ViewChild('imageContainer') imageContainer: ElementRef;
    imageContainerSize: { width: number, height: number } = { width: 0, height: 0 };
    showLoader: boolean = false;
    cropForm: FormGroup;
    diff: boolean = false;
    submitted: boolean = false;
    cropper: Cropper;
    cropperOptions: Cropper.Options = {
        viewMode: 3,
        dragMode: 'move',
        autoCropArea: 1,
        restore: false,
        modal: false,
        guides: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        crop: (e: Cropper.CropEvent) => { this.cropChange(e); },
        zoom: (e: Cropper.ZoomEvent) => { this.cropStart(e); },
        cropstart: (e: Cropper.CropStartEvent) => { this.cropStart(e); },
        ready: () => { this.setCropArea(); }
    };

    constructor(
        public dialogRef: MatDialogRef<CropDialog>,
        @Inject(PLATFORM_ID) private platformId: any,
        private formBuilder: FormBuilder,
        private renderer: Renderer2,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.diff = !this.data.editMode;
        this.cropperOptions.aspectRatio = data.ratio.width / data.ratio.height;
        const { width: cropBoxWidth, height: cropBoxHeight } = this.data.ratio;
        const maxCropBoxSize = data.isMobile ? this.maxCropBoxSize.mobile : this.maxCropBoxSize.desktop;
        if (cropBoxWidth > cropBoxHeight) {
            this.imageContainerSize.width = maxCropBoxSize;
            this.imageContainerSize.height = maxCropBoxSize / (cropBoxWidth / cropBoxHeight);
        } else {
            this.imageContainerSize.width = maxCropBoxSize / (cropBoxHeight / cropBoxWidth);
            this.imageContainerSize.height = maxCropBoxSize;
        }
    }

    ngOnInit(): void {
        const cropArea = this.data.cropArea || null;
        this.cropForm = this.formBuilder.group({
            cropArea: [cropArea, Validators.required]
        });
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        const imageContainer = this.imageContainer.nativeElement;
        this.renderer.setStyle(imageContainer, 'width', `${this.imageContainerSize.width}px`);
        this.renderer.setStyle(imageContainer, 'height', `${this.imageContainerSize.height}px`);

        if (this.cropper)
            this.cropper.destroy();

        this.cropper = new Cropper(this.imageContainer.nativeElement.firstChild, this.cropperOptions);
    }

    cropStart(e: Cropper.CropStartEvent | Cropper.ZoomEvent) {
        this.diff = true;
    }

    cropChange(e: Cropper.CropEvent) {
        const canvasData = this.cropper.getCanvasData();
        const cropArea = {
            x: e.detail.x,
            y: e.detail.y,
            width: e.detail.width,
            height: e.detail.height,
            zoom: canvasData.naturalWidth / e.detail.width
        }

        this.cropForm.controls.cropArea.setValue(cropArea);
    }

    setCropArea(): void {
        if (!this.data.cropArea) return;

        const canvasData = this.cropper.getCanvasData();
        const containerData = this.cropper.getContainerData();
        const cropArea = this.data.cropArea;
        const zoom = containerData.width / cropArea.width;

        this.cropper.setCanvasData({
            left: cropArea.x * zoom * -1,
            top: cropArea.y * zoom * -1,
            width: canvasData.naturalWidth * zoom,
            height: canvasData.naturalHeight * zoom
        });
    }

    async onSubmit() {
        this.submitted = true;
        if (this.cropForm.invalid) {
            return;
        }

        this.showLoader = true;
        const cropArea = this.cropForm.controls.cropArea.value;
        this.dialogRef.close(cropArea);
    }
}