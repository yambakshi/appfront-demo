import { env } from '../../../config';
import { mongoDb } from '../../dal';


export async function queryRestaurant({ restaurantName }: { restaurantName: string }) {
    const filter = { name: restaurantName };
    const cursor = await mongoDb.find(env.mongodb.dbName, 'restaurants', filter);
    const [restaurant] = await cursor.toArray();
    const { name, brandColors, menu, image, } = restaurant;

    return { name, brandColors, image, menu };
}