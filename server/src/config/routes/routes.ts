import { Router } from "express";
import {
    register,
    // login,
    // getPublishedRestaurant
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

// router.route('/auth/login')
//     .post(loginMiddleware, login);

// Restaurants

// router.route('/published-restaurant/:restaurantId')
//     .get(getPublishedRestaurant);