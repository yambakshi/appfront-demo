import { cloudinaryWrapper } from '../../../config';


export async function deleteFolder(folderPath: string) {
    return cloudinaryWrapper.deleteFolder(folderPath);
}