import { env } from '../../../config';
import { mongoDb } from '../../dal';
import bcrypt from 'bcrypt';


export async function validateUser(email: string, password: string) {
    const inavlidUserMessage = "Incorrect username or password";
    const user = await mongoDb.findOne(env.mongodb.dbName, 'users', { email: email.toLowerCase() });

    if (!user) {
        return Promise.reject(inavlidUserMessage);
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
        return Promise.reject(inavlidUserMessage);
    }

    return user;
}