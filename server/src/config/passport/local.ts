import passportLocal from "passport-local";
import { validateUser } from "../../app/services";


export const localStrategy = new passportLocal.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await validateUser(email, password);
        return done(null, user);
    } catch (error: any) {
        return done(null, false, { message: error });
    }
})