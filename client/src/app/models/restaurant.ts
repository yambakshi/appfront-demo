import { ImageLoad } from "./graphics";
import { MenuItem } from "./menu-item";

export class Restaurant {
    _id: string;
    name: string;
    brandColors: string[];
    image: ImageLoad;
    menu: MenuItem[];
    specials: MenuItem[];

    constructor(restaurant?: Restaurant) {
        if (!restaurant) return;
        this._id = restaurant._id;
        this.name = restaurant.name;
        this.brandColors = restaurant.brandColors;
        this.image = restaurant.image;
        this.menu = restaurant.menu;
        this.specials = restaurant.specials;
    }
}