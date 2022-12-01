export class ImageInputConfig {
    label: string = 'Upload Image';
    ratio?: { width: number, height: number } = { width: 1, height: 1 };
    recommended?: { width: number, height: number } = { width: 1000, height: 1000 };
    required?: boolean = false;
    cropEnabled?: boolean = false;
    ratioErrorCropEnabled?: boolean = false;
}