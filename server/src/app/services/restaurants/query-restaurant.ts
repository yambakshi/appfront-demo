import { env } from '../../../config';
import { mongoDb } from '../../dal';


export async function queryRestaurant({ name }: { name: string }) {
    const filter = { name };
    const cursor = await mongoDb.find(env.mongodb.dbName, 'restaurants', filter);
    return cursor.toArray();
}