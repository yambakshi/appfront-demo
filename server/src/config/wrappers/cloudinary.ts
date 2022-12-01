import { env } from '../env';
import cloudinary from 'cloudinary';
import fs from 'fs';


class Cloudinary {
    constructor() {
        cloudinary.v2.config(env.cloudinary);
    }

    async upload(imagePath: string, folder: string) {
        const options = { folder };
        const res = await cloudinary.v2.uploader.upload(imagePath, options);
        fs.unlinkSync(imagePath);

        return res;
    }

    deleteResources(publicIds: string[]) {
        return cloudinary.v2.api.delete_resources(publicIds);
    }

    deleteFolder(folderPath: string) {
        return cloudinary.v2.api.delete_folder(folderPath);
    }
}

export const cloudinaryWrapper = new Cloudinary();