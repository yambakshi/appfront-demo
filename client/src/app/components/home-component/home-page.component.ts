import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: [
        './home-page.component.common.scss',
        './home-page.component.mobile.scss'
    ]
})
export class HomePageComponent implements OnInit {
    constructor(
        private route: ActivatedRoute) {
        this.route.data.subscribe(data => {
            if (!data['resolverResponse']) {
                return;
            }
        });
    }

    ngOnInit(): void { }
}