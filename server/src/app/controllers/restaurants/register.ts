import { Request, Response } from 'express';
import { logger } from '../../../config';
import { insertRestaurant } from '../../services';
// import { validateUserRegistration } from '../../validators';


async function processRegistration(user: any) {
    // const validationErrors = validateUserRegistration(user);
    // if (validationErrors) {
    //     const firstErr = validationErrors[0];
    //     throw new Error(`Invalid request(${firstErr.keyword}): user ${firstErr.data} ${firstErr.message}`);
    // }

    user.email = user.email.toLowerCase();
    const output = insertRestaurant(user);
    return output;
}

export async function register(req: Request, res: Response) {
    try {
        logger.info({ message: "Received 'register' request", label: 'regiter' });
        const output = await processRegistration(req.body);
        res.send(output);
    } catch (error: any) {
        logger.error({ message: error.message, label: 'register' });
        res.status(500).send({ success: false, message: error.message });
    }
}