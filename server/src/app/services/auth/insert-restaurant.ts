import { env } from '../../../config';
import { mongoDb } from '../../dal';
import bcrypt from 'bcrypt';
import { Restaurant } from '../../models';
import { uploadSingleGraphic } from '../graphics-storage';


export async function insertRestaurant(restaurant: Restaurant) {
    const { email, password } = restaurant;
    const existingRestaurant = await mongoDb.findOne(env.mongodb.dbName, 'restaurants', { email });
    if (existingRestaurant) {
        return Promise.reject({ message: 'Restaurant already exist' });
    }

    const rootFolder = `restaurants/${restaurant.name}/graphics`;
    restaurant.image = await uploadSingleGraphic(restaurant.image, rootFolder);

    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    restaurant.password = hash
    restaurant.createdAt = new Date();

    const output = mongoDb.insertMany(env.mongodb.dbName, 'restaurants', [restaurant]);

    return output;
}