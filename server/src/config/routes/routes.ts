import { Router } from "express";
import {
    register, login,
    getPublishedRestaurant
} from '../../app/controllers';
import { loginMiddleware } from "../middlewares";


export const router = Router();

// Auth

router.route('/auth/register')
    .post(register);

router.route('/auth/login')
    .post(loginMiddleware, login);

// Restaurants

router.route('/published-restaurant/:restaurantId')
    .get(getPublishedRestaurant);