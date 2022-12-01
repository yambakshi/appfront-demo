import { ImageLoad } from '../../models';
import { cloudinaryWrapper } from '../../../config';
import { env } from '../../../config';


export async function uploadSingleGraphic(imageLoad: ImageLoad, folder: string): Promise<ImageLoad> {
    const rootFolder = `appfront-demo/environments/${env.nodeEnv}`;
    const uploadedGraphic = new ImageLoad();
    uploadedGraphic.file = imageLoad.file;
    uploadedGraphic.imageId = (await cloudinaryWrapper.upload(imageLoad.path, `${rootFolder}/${folder}`)).public_id;

    if (imageLoad.cropArea) {
        uploadedGraphic.cropArea = imageLoad.cropArea;
    }

    return uploadedGraphic;
}