import passport from 'passport';
import authConfig from './config/oauth'
const user = { id: 1, username: 'test' };
import User from './models/user';
import roles from "./roles";

passport.serializeUser((user, done) => {
    console.log('user', user);
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
})

import { Strategy as LocalStrategy } from 'passport-local';
passport.use(new LocalStrategy((email, password, done) => {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email': email }, (err, user) => {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });
    }
));

passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {
        console.log("email", email);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(() => {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email': email }, (err, user) => {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    const newUser = new User();

                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(err => {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });

        });

    }));

import { Strategy as FacebookStrategy } from 'passport-facebook';
passport.use(new FacebookStrategy({
        clientID: authConfig.facebook.clientID,
        clientSecret: authConfig.facebook.clientSecret,
        callbackURL: `http://127.0.0.1:${process.env.PORT || 1337}/auth/facebook/callback`,
        profileFields: ['email', "displayName"]
    },
    (token, tokenSecret, profile, done) => {
        // retrieve user ...
        console.log(profile);
        console.log("user", user);
        process.nextTick(() => {
            //check user table for anyone with a facebook ID of profile.id
            const newUser = {};
            newUser.facebook = profile._json;
            newUser.facebook.token = token;
            findOrCreate({
                'facebook.id': profile.id 
            }, newUser, done);
        });
    }
))

import { Strategy as TwitterStrategy } from 'passport-twitter';
passport.use(new TwitterStrategy({
        consumerKey: authConfig.twitter.consumerKey,
        consumerSecret: authConfig.twitter.consumerSecret,
        callbackURL: `http://127.0.0.1:${process.env.PORT || 1337}/auth/twitter/callback`
    },
    (token, tokenSecret, profile, done) => {
        // retrieve user ...
        console.log("user", profile)
        process.nextTick(() => {
            //check user table for anyone with a facebook ID of profile.id
            const newUser = {};
            newUser.twitter = profile;
            newUser.twitter.token = token;
            findOrCreate({
                'twitter.id': profile.id 
            }, newUser, done);
        });
    }
))

import { Strategy as GoogleStrategy } from 'passport-google-auth';
passport.use(new GoogleStrategy({
        clientId: authConfig.google.clientID,
        clientSecret: authConfig.google.clientSecret,
        callbackURL: `http://127.0.0.1:${process.env.PORT || 1337}/auth/google/callback`
    },
    (token, tokenSecret, profile, done) => {
        // retrieve user ...
        console.log("user", profile)
        process.nextTick(() => {
            //check user table for anyone with a facebook ID of profile.id
            const newUser = {};
            newUser.google = profile;
            newUser.google.name = profile.displayName;
            newUser.google.token = token;
            newUser.google.email = profile.emails[0].value;
            findOrCreate({
                'google.id': profile.id 
            }, newUser, done);
        });
    }
))

import { Strategy as GithubStrategy } from 'passport-github';
passport.use(new GithubStrategy({
        clientID: authConfig.github.clientID,
        clientSecret: authConfig.github.clientSecret,
        callbackURL: `http://127.0.0.1:${process.env.PORT || 1337}/auth/github/callback`,
        scope: [ 'user:email' ]
    },
    (token, tokenSecret, profile, done) => {
        // retrieve user ...
        console.log(profile, token);
        // done(null, user)
        process.nextTick(() => {
            //check user table for anyone with a facebook ID of profile.id
            const newUser = {};
            newUser.github = profile;
            newUser.github.name = profile.displayName;
            newUser.github.token = token;
            newUser.github.email = profile.emails[0].value;

            findOrCreate({
                'github.id': profile.id 
            }, newUser, done);
        });
    }
))

import { Strategy as InstagramStrategy } from 'passport-instagram';
passport.use(new InstagramStrategy({
        clientID: authConfig.instagram.clientID,
        clientSecret: authConfig.instagram.clientSecret,
        callbackURL: `http://127.0.0.1:${process.env.PORT || 1337}/auth/instagram/callback`
    },
    (token, tokenSecret, profile, done) => {
        // retrieve user ...
        process.nextTick(() => {
            //check user table for anyone with a facebook ID of profile.id
            const newUser = {};
            newUser.instagram = profile;
            newUser.instagram.name = profile.displayName;
            newUser.instagram.token = token;
            findOrCreate({
                'instagram.id': profile.id 
            }, newUser, done);
        });
    }
))

import { Strategy as LinkedInStrategy } from 'passport-linkedin';
passport.use(new LinkedInStrategy({
        consumerKey: authConfig.linkedin.consumerKey,
        consumerSecret: authConfig.linkedin.consumerSecret,
        callbackURL: `http://127.0.0.1:${process.env.PORT || 1337}/auth/linkedin/callback`,
        profileFields: ['id', 'first-name', 'last-name', 'email-address']
    },
    (token, tokenSecret, profile, done) => {
        // retrieve user ...
        console.log(profile);
        process.nextTick(() => {
            //check user table for anyone with a facebook ID of profile.id
            const newUser = {};
            newUser.linkedin = profile;
            newUser.linkedin.name = profile.displayName;
            newUser.linkedin.token = token;
            newUser.linkedin.email = profile.emails[0].value
            findOrCreate({
                'linkedin.id': profile.id 
            }, newUser, done);
        });
    }
))

function findOrCreate(query, newFields, done) {
    try{
        User.findOne(query, (err, user) => {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                const newUser = {};
                for(const item in newFields){
                    newUser[item] = newFields[item];
                }
                user = new User(newUser);
                user.save(err => {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
    } catch(err) {
        throw new Error("Error in findOrCreate function.");
    }
}

// Checking if the user role is having the action or not.
// USAGE: checkRole("super-admin", "delete_user");
// This will check the delete_user action in super-admin role in roles json
function checkRole (role, action) {
    if(action.constructor == String) {
        const roleActions = roles[role];
        if(roleActions) {
            if(roleActions.includes(action)) {
               return true; 
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}