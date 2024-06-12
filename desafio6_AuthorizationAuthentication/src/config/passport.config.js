import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';


const LocalStrategy = local.Strategy


const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23lihDzEfrMFCZCscn",
        clientSecret: "1bb18684ff08f72064f60b17d18e3337ffde91bb",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(accessToken, refreshToken, profile);
            try{
                let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.login,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    age: 33, 
                    password: "",
                    role: "usuario"
                };
                let result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
        

    passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
        try {

            let user = await userModel.findOne({ email: username })

                if (user) {
                    console.log('Usuario ya existe')
                    return done(null, false)
                }
                const {body} = req
                body.password = createHash(password)
                console.log({ body })

                const newUser = await userModel.create(body)
                return done(null, newUser)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        try {
            console.log('serializeUser')
            done(null, user._id)
        } catch (error) {
            done(error);
        }
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    passport.use("login", new LocalStrategy(
    { usernameField: "email" },
    async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })

            if (!user) {
                console.log('El usuario no existe en el sistema')
                return done(null, false, { message: 'El usuario no existe en el sistema' })
            }
            if (!isValidPassword(user, password)) {
                return done(null, false, { message: 'Datos incorrectos' })
            }

            //En el if de isValidPassword, el primer y segundo parametro serian (password, user.password)
            /* user = user.toObject()
            delete user.password */

            done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
}


export default initializePassport;