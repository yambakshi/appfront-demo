import { cloudinaryWrapper } from '../../../config';


export async function deleteGraphics(publicIds: string[]): Promise<any> {
    if (publicIds.length === 0) return;
    return cloudinaryWrapper.deleteResources(publicIds);
}