import { Injectable } from "@angular/core";
import { Cloudinary } from '@cloudinary/angular-5.x';
import { CropArea } from "@models/graphics";

type CloudinaryOptions = { secure: boolean, loading?: string, transformation: any[] };

@Injectable({
    providedIn: 'root'
})
export class CloudinaryService {
    defaultOptions: CloudinaryOptions = { secure: true, transformation: [{ fetch_format: "auto" }] };
    constructor(private cloudinary: Cloudinary) { }

    getCloudinaryUrl(imageId: string, cropArea?: CropArea, lazyLoading: boolean = false): string {
        const options: CloudinaryOptions = JSON.parse(JSON.stringify(this.defaultOptions));
        if (lazyLoading) {
            options.loading = 'lazy';
        }

        if (cropArea) {
            const { x, y, width, height } = cropArea;
            options.transformation.unshift({
                width: Math.round(width),
                height: Math.round(height),
                x: Math.round(x),
                y: Math.round(y),
                crop: "crop"
            })
        }

        return this.cloudinary.url(imageId, options);
    }
}