import passport from 'passport';
import { jwtStrategy } from '../passport/jwt';
import { localStrategy } from '../passport/local';

export function configPassport() {
    passport.use(localStrategy);
    passport.use(jwtStrategy);
}