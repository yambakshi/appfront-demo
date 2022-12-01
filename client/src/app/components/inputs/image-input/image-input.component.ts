import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Inject, Input, Output, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { ImageInputConfig } from '@models/form-utils';
import { ImageLoad, CropArea } from '@models/graphics';
import { WindowRefService } from '@services/window-ref.service';
import { CropDialog } from '@components/inputs/crop-dialog/crop.dialog';
import { MatDialog } from '@angular/material/dialog';
import { validateDimensionsRatio, validateExtension, validateFileSize } from '@utilities/file-inputs-validators';
import { ApproveDialog } from '@components/inputs/approve-dialog/approve.dialog';
import { of } from 'rxjs';
import { Cloudinary } from '@cloudinary/angular-5.x';


enum ErrorType { Read, Size, Ratio, Extension, Required }
export enum ChangeType { Selected, Crop, Removed, Error }

@Component({
  selector: 'image-input',
  templateUrl: './image-input.component.html',
  styleUrls: [
    './image-input.component.common.scss',
    './image-input.component.mobile.scss'
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: ImageInput
  },
  {
    provide: NG_VALIDATORS,
    multi: true,
    useExisting: ImageInput
  }]
})
export class ImageInput implements ControlValueAccessor, AfterViewInit {
  readonly uploadRestrictions = { formats: ['jpg', 'png'], maxFileSize: 10 };
  @Input() config: ImageInputConfig = new ImageInputConfig();
  @Input() submitted: boolean = false;
  @Output() imageLoaded: EventEmitter<HTMLImageElement> = new EventEmitter<HTMLImageElement>();
  @Output() imageLoadChanged: EventEmitter<{ changeType: ChangeType, imageLoad: ImageLoad }> = new EventEmitter<{ changeType: ChangeType, imageLoad: ImageLoad }>();
  @Output() dialogStatusChanged: EventEmitter<{ opened: boolean }> = new EventEmitter<{ opened: boolean }>();
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('imagePreviewContainer') imagePreviewContainer: ElementRef;
  dialogsSizes = { approve: { isMobile: false, style: {} }, crop: { isMobile: false, style: {} } };
  imageLoad: ImageLoad = new ImageLoad();
  imageError: { message: string, type: ErrorType };
  showImageLoader: boolean = false;
  touched: boolean = false;
  disabled: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private cloudinary: Cloudinary,
    public dialog: MatDialog,
    private renderer: Renderer2) { }

  get formats() {
    return this.uploadRestrictions.formats.map(ext => `.${ext}`).join(', ');
  }

  get imgSrc() {
    const dataUrl = this.imageLoad.dataUrl;
    const clUrl = this.cloudinary.url(this.imageLoad.imageId, { secure: true, transformation: [{ fetch_format: "auto" }] });
    return dataUrl || clUrl;
  }

  ngOnChanges(): void {
    if (this.submitted && this.config.required && !this.imageLoad.dataUrl) {
      this.imageError = { message: 'Required', type: ErrorType.Required };
    } else {
      this.imageError = null;
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.calcDialogsSizes();
  }

  onFileChange(): void {
    const fileInput = this.fileInput.nativeElement;
    if (typeof (FileReader) !== 'undefined' && fileInput.files.length > 0) {
      const reader = new FileReader();
      const file: File = fileInput.files[0];
      let error = validateExtension(file.name, this.uploadRestrictions.formats);
      if (error) {
        this.updateImageLoad(null, { message: error, type: ErrorType.Extension });
        return;
      }

      reader.readAsDataURL(file);
      this.showImageLoader = true;

      reader.onload = async (e: any) => {
        const dataUrl = e.target.result;
        if (!dataUrl) {
          this.updateImageLoad(null, { message: 'Cannot read file', type: ErrorType.Read });
          return;
        }

        error = validateFileSize(dataUrl, 'image/png', this.uploadRestrictions.maxFileSize);
        if (error) {
          this.updateImageLoad(null, { message: error, type: ErrorType.Size });
          return;
        }

        if (this.config.ratio && !this.config.cropEnabled) {
          error = await validateDimensionsRatio(dataUrl, this.config.ratio);
          if (error) {
            const imageLoad = this.config.ratioErrorCropEnabled ? { file: file, dataUrl: dataUrl } : null;
            this.updateImageLoad(imageLoad, { message: error, type: ErrorType.Ratio });
            return;
          }
        }

        const imageLoad = {
          file: file,
          dataUrl: dataUrl
        }

        this.updateImageLoad(imageLoad);
      };
    }
  }

  onImageLoad(imgElement) {
    this.imageLoaded.emit(imgElement);
    this.positionImage();
  }

  updateImageLoad(imageLoad: ImageLoad, error?: { message: string, type: ErrorType }): void {
    this.showImageLoader = false;
    this.imageError = (!error || error.type !== ErrorType.Ratio || !this.config.ratioErrorCropEnabled) ? error : null;
    if (this.imageError) {
      this.fileInput.nativeElement.value = null;
      this.onChange(this.imageLoad);
      this.imageLoadChanged.emit({ changeType: ChangeType.Error, imageLoad: this.imageLoad });
      return;
    }

    if (this.config.cropEnabled || (error && error.type === ErrorType.Ratio && this.config.ratioErrorCropEnabled)) {
      const dialogCallback = (cropArea: CropArea) => {
        this.dialogStatusChanged.emit({ opened: false });
        if (!cropArea) {
          this.fileInput.nativeElement.value = null;
          this.imageError = this.config.required && { message: 'Required', type: ErrorType.Required };
          return;
        }

        this.imageError = null;
        this.imageLoad = { ...imageLoad, cropArea };
        this.onChange(this.imageLoad);
        this.imageLoadChanged.emit({ changeType: ChangeType.Selected, imageLoad: this.imageLoad });
      }

      const dialogData = {
        editMode: false,
        imgSrc: imageLoad.dataUrl,
        ratio: this.config.ratio,
        cropArea: null
      };

      this.showCropDialog(dialogData, dialogCallback);
    } else {
      this.imageError = null;
      this.imageLoad = imageLoad;
      this.onChange(this.imageLoad);
      this.imageLoadChanged.emit({ changeType: ChangeType.Selected, imageLoad: this.imageLoad });
    }
  }

  positionImage(): void {
    if (!this.imageLoad.cropArea) return;
    const { cropArea } = this.imageLoad;
    const container = this.imagePreviewContainer.nativeElement;
    const img = container.firstChild;
    const zoom = container.clientWidth / cropArea.width;
    const { left, top } = {
      left: cropArea.x * zoom * -1,
      top: cropArea.y * zoom * -1
    }

    this.renderer.setStyle(img, 'margin', `${top}px 0 0 ${left}px`);
    this.renderer.setStyle(img, 'width', `${100 * cropArea.zoom}%`);
  }

  removeImage($event): void {
    $event.stopPropagation();
    const filename = this.imageLoad.file.name;
    const label = 'Remove Image'
    const message = { before: 'image ', bold: filename, after: '' };
    const approveFunction = () => of(true);
    this.showApproveDialog({ label, message, approveFunction });
  }

  showApproveDialog(data): void {
    this.dialogStatusChanged.emit({ opened: true });
    const dialogRef = this.dialog.open(ApproveDialog, {
      ...this.dialogsSizes.approve.style,
      data: { ...data, isMobile: this.dialogsSizes.approve.isMobile }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.dialogStatusChanged.emit({ opened: false });
      if (!res) return;

      this.imageLoad = new ImageLoad();
      this.imageError = this.config.required && { message: 'Required', type: ErrorType.Required };
      this.fileInput.nativeElement.value = null;
      const container = this.imagePreviewContainer.nativeElement;
      const img = container.firstChild;
      this.renderer.setStyle(img, 'margin', 0);
      this.renderer.setStyle(img, 'width', '100%');
      this.onChange(this.imageLoad);
      this.imageLoadChanged.emit({ changeType: ChangeType.Removed, imageLoad: this.imageLoad });
    });
  }

  editCrop($event): void {
    $event.stopPropagation();
    const dialogCallback = (cropArea: CropArea) => {
      this.dialogStatusChanged.emit({ opened: false });
      if (!cropArea) return;

      this.imageLoad.cropArea = cropArea;
      this.showImageLoader = false;
      this.positionImage();
      this.onChange(this.imageLoad);
      this.imageLoadChanged.emit({ changeType: ChangeType.Crop, imageLoad: this.imageLoad });
    }

    const dialogData = {
      editMode: true,
      imgSrc: this.imgSrc,
      ratio: this.config.ratio,
      cropArea: this.imageLoad.cropArea
    };

    this.showCropDialog(dialogData, dialogCallback);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.calcDialogsSizes();
  }

  calcDialogsSizes(): void {
    // If in mobile
    if (this.windowRefService.nativeWindow.innerWidth < 901) {
      const fullScreen = { maxWidth: '100vw', height: '100%', width: '100%' };
      this.dialogsSizes.approve = { isMobile: true, style: fullScreen };
      this.dialogsSizes.crop = { isMobile: true, style: fullScreen };
    } else {
      this.dialogsSizes.approve = { isMobile: false, style: { width: '400px' } };
      this.dialogsSizes.crop = { isMobile: false, style: { width: '600px' } };
    }
  }

  showCropDialog(data, dialogCallback): void {
    this.dialogStatusChanged.emit({ opened: true });
    const dialogRef = this.dialog.open(CropDialog, {
      ...this.dialogsSizes.crop.style,
      data: { ...data, isMobile: this.dialogsSizes.crop.isMobile }
    });

    dialogRef.afterClosed().subscribe(dialogCallback);
  }

  onTouched = () => { };

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  onChange = (imageLoad: ImageLoad) => { };

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  writeValue(imageLoad: ImageLoad) {
    if (imageLoad) {
      const positionImage = (imageLoad.imageId &&
        this.imageLoad.imageId &&
        imageLoad.imageId === this.imageLoad.imageId) &&
        imageLoad.cropArea;

      this.imageLoad = imageLoad;
      positionImage && this.positionImage();
    } else {
      if (this.fileInput) {
        this.fileInput.nativeElement.value = null;
      }

      this.imageLoad = new ImageLoad();
    }
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.config.required) return null;

    const forbidden = !(control.value && (control.value.dataUrl || control.value.imageId));
    return forbidden ? { imageLoad: { value: control.value } } : null;
  }
}