import { fileUpload } from '../../init/multer';

export function uploadFilesMiddleware(req, res, next) {
    fileUpload.any()(req, res, (err) => {
        next(err);
    })
}