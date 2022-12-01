import { env } from '../../../config';
import { mongoDb } from '../../dal';
import bcrypt from 'bcrypt';


export async function setPassword(password: string): Promise<{ success: boolean, message: string }> {
    const email = 'yambakshi@gmail.com';
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const update = { $set: { password: hash, lastModified: new Date() } };
    const { modifiedCount } = await mongoDb.updateOne(env.mongodb.dbName, 'users', { email }, update);
    const success = !!modifiedCount;

    return {
        success,
        message: success ?
            'Successfully changed password' :
            'Failed to change password'
    };
}