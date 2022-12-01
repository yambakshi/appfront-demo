import { Router } from "express";
import {
    logout, changePassword,
    createRelease, updateRelease, deleteReleases, getReleases
} from '../../app/controllers';
import { uploadFormatterMiddleware, uploadFilesMiddleware, requestTimerMiddleware } from "../middlewares";


export const authRouter = Router();

// Auth

authRouter.route('/auth/logout')
    .post(logout);

authRouter.route('/auth/change-password')
    .post(changePassword);

// Releases

authRouter.route('/releases/:routeName?/:pageType?')
    .get(getReleases)
    .put(
        (req, res, next) => {
            const requestTimeout = 1000 * 60 * 60; // 1 hour
            res.setTimeout(requestTimeout);
            next();
        },
        requestTimerMiddleware,
        uploadFilesMiddleware,
        uploadFormatterMiddleware,
        createRelease)
    .post(
        (req, res, next) => {
            const requestTimeout = 1000 * 60 * 60; // 1 hour
            res.setTimeout(requestTimeout);
            next();
        },
        requestTimerMiddleware,
        uploadFilesMiddleware,
        uploadFormatterMiddleware,
        updateRelease)
    .delete(
        requestTimerMiddleware,
        deleteReleases);