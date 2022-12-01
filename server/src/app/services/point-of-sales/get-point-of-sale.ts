import { env } from '../../../config';
import { mongoDb } from '../../dal';


export async function getPointOfSale(restaurantName: string) {
    const filter = { restaurantName };
    const cursor = await mongoDb.find(env.mongodb.dbName, 'point-of-sales', filter);
    return cursor.toArray();
}