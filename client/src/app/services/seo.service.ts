import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { CloudinaryService } from './cloudinary.service';


@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private cloudinaryService: CloudinaryService,
        private titleService: Title,
        private meta: Meta) {
    }

    setTags(title: string, favicon?: string, og?: string): void {
        const links = [
            { rel: 'icon', href: favicon },
            { rel: 'canonical', href: this.document.URL },
            { rel: 'image_src', href: '' }
        ];

        this.titleService.setTitle(title);
    }
}