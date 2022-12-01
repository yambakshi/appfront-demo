import { isPlatformBrowser } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ImageLoad } from "@models/graphics";
import { SeoService } from "@services/seo.service";

@Component({
    selector: 'page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: [
        './page-not-found.component.common.scss',
        './page-not-found.component.mobile.scss'
    ]
})
export class PageNotFoundComponent {
    constructor(private seoService: SeoService) {
        this.seoService.setTags('404');
    }
}