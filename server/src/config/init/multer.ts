import path from 'path';
import multer from 'multer';

export const fileUpload = multer({
    dest: path.resolve(__dirname, '../../tmp/'),
    limits: { fieldSize: 25 * 1024 * 1024 }
})