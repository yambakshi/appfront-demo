import { Router } from "express";
import {
    register,getRestaurant
} from '../../app/controllers';
import { uploadFormatterMiddleware, uploadFilesMiddleware, requestTimerMiddleware } from "../middlewares";


export const router = Router();

// Auth

router.route('/auth/sign-up')
    .put(
        requestTimerMiddleware,
        uploadFilesMiddleware,
        uploadFormatterMiddleware,
        register);

// Restaurants

router.route('/restaurant/:restaurantName')
    .get(getRestaurant);