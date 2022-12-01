import cors from 'cors';
import compression from 'compression';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import { router } from '../routes';
import { env } from '../env';


export function configApp(app, port) {
    app.use(compression({ threshold: 512 }));
    app.use(cors({ origin: env.cors.origin }));
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.set('port', port);
    app.use('/api', router);
    app.use((req, res) => {
        res.send({ success: false, message: 'Invalid request' });
    })
}