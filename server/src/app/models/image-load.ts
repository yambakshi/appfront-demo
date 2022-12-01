import { CropArea } from "./crop-area";
import { FileLoad } from "./file-load";

export class ImageLoad extends FileLoad {
    imageId: string;
    cropArea?: CropArea;

    constructor(imageLoad?: ImageLoad) {
        super(imageLoad);
        if (!imageLoad) return;
        this.imageId = imageLoad.imageId;
        this.cropArea = imageLoad.cropArea;
    }
}