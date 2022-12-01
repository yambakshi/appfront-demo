export function validateExtension(filename: string, formats: string[]): string {
    let error: string;
    const ext = filename.split('.').pop().toLowerCase();
    if (!formats.includes(ext)) {
        error = `File format '${ext}' is not allowed`;
    }

    return error;
}

export function validateFileSize(dataUrl: string, mimeType: string, maxFileSize: number): string {
    let error: string;
    const head = `data:${mimeType};base64,`;
    const imgFileSize = Math.round((dataUrl.length - head.length) * 3 / 4) / 1024;

    // If file size is exceeds max file size (in MB)
    if (imgFileSize > maxFileSize * 1000) {
        error = `File size exceeds ${maxFileSize}MB`;
    }

    return error;
}

export function validateDimensionsRatio(dataUrl: string, { width, height }: { width: number, height: number }): Promise<string> {
    return new Promise((resolve, reject) => {
        let error: string;
        const image = new Image();
        image.src = dataUrl;
        image.onload = (e) => {
            const img: any = e.target;
            if (img.width / img.height !== width / height) {
                error = `Image width and height ratio must be ${width}:${height}`;
            }

            resolve(error);
        }
    })
}