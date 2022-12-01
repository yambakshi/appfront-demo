import passport from 'passport';


export function loginMiddleware(req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }

        if (!user) {
            return res.send({ success: false, message: info.message });
        }

        req.login(user, { session: false }, error => {
            if (error) {
                return next(error)
            }

            next();
        })
    })(req, res, next)
}