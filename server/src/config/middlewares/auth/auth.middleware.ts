import passport from 'passport';


export function authMiddleware(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }

        if (!user) {
            return res.send({ success: false, message: 'User is not logged in' });
        }

        req.user = user;

        next();
    })(req, res, next)
}