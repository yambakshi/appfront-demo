import { ImageLoad } from "./image-load";
import { MenuItem } from "./menu-item";

export class Restaurant {
    _id: string;
    email: string;
    password: string;
    name: string;
    brandColors: string[];
    pictures: ImageLoad[];
    image: ImageLoad;
    menu: MenuItem[];
    specials: MenuItem[];
    createdAt: Date = new Date();

    constructor(restaurant?: Restaurant) {
        if (!restaurant) return;
        this._id = restaurant._id;
        this.name = restaurant.name;
        this.brandColors = restaurant.brandColors;
        this.pictures = restaurant.pictures;
        this.menu = restaurant.menu;
        this.specials = restaurant.specials;
    }
}