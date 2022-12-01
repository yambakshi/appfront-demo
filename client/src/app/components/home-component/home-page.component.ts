import { isPlatformBrowser } from "@angular/common";
import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ImageLoad } from "@models/graphics";
import { Restaurant } from "@models/restaurant";
import { RestaurantsApiService } from "@services/apis";
import { CloudinaryService } from "@services/cloudinary.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: [
        './home-page.component.common.scss',
        './home-page.component.mobile.scss'
    ]
})
export class HomePageComponent {
    @ViewChild('homePageContainer') homePageContainer: ElementRef;
    restaurant: Restaurant;
    subscriptions: { restaurant: Subscription } = { restaurant: null };

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private restaurantsApiService: RestaurantsApiService,
        private cloudinaryService: CloudinaryService,
        private renderer: Renderer2,
        private route: ActivatedRoute) {
        this.route.data.subscribe(data => {
            if (!data['resolverResponse']) {
                return;
            }
        });

        this.subscriptions.restaurant = this.restaurantsApiService.getRestaurantObservable().subscribe((restaurant: Restaurant) => {
            this.restaurant = restaurant;
        });
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        const { image } = this.restaurant;
        const backgroundUrl = this.getClUrl(image);
        const backgroundImageUrl = backgroundUrl;

        const homePageContainerEl = this.homePageContainer.nativeElement;
        this.renderer.setStyle(homePageContainerEl.firstChild.firstChild, 'background-image', `url(${backgroundImageUrl})`);
    }

    private getClUrl({ imageId, cropArea }: ImageLoad): string {
        return this.cloudinaryService.getCloudinaryUrl(imageId, cropArea);
    }
}