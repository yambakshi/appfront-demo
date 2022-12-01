export class FileLoad {
    path?: string;
    file?: { name: string, size: number };

    constructor(fileLoad?: FileLoad) {
        if (!fileLoad) return;
        this.path = fileLoad.path;
        this.file = fileLoad.file;
    }
}