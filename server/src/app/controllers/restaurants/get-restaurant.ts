import { Request, Response } from 'express';
import { queryRestaurant } from '../../services';
import { logger } from '../../../config';


export async function getRestaurant(req: Request, res: Response) {
    try {
        logger.info({ message: "Received 'getRestaurant' request", label: 'getRestaurant' });
        const query = req.params.id ? [req.params.id] : [];
        const output = await queryRestaurant(query);
        res.send(output);
    } catch (error: any) {
        logger.error({ message: error.message, label: 'getRestaurant' });
        res.status(500).send({ success: false, message: error.message });
    }
}