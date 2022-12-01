import { env } from '../../../config';
import { mongoDb } from '../../dal';
import bcrypt from 'bcrypt';
import { Restaurant } from '../../models';
import { uploadSingleGraphic } from '../graphics-storage';
import { getPointOfSale } from '../point-of-sales';


export async function insertRestaurant(restaurant: Restaurant) {
    const { email, password, name } = restaurant;
    const existingRestaurant = await mongoDb.findOne(env.mongodb.dbName, 'restaurants', { email });
    if (existingRestaurant) {
        return {
            success: false,
            message: 'Email already exist'
        };
    }

    const rootFolder = `restaurants/${restaurant.name}/graphics`;
    restaurant.image = await uploadSingleGraphic(restaurant.image, rootFolder);

    const [pointOfSaleData] = await getPointOfSale(name) as any;
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    restaurant.password = hash;
    restaurant.menu = pointOfSaleData.menu;
    restaurant.createdAt = new Date();

    const output = mongoDb.insertMany(env.mongodb.dbName, 'restaurants', [restaurant]);

    return {
        success: true,
        message: 'Successfully boarded restaurant',
        data: restaurant
    };
}