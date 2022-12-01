export class FileLoad {
    dataUrl: string = '';
    file: File = null;
    path?: string;

    constructor(fileLoad?: FileLoad) {
        if (!fileLoad) return;
        this.dataUrl = fileLoad.dataUrl;
        this.file = fileLoad.file;
        this.path = fileLoad.path;
    }
}