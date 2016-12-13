import authConfig from '../config/oauth'
import passport from 'passport'
import express from 'express';
const router = express.Router();

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log(user)
    done(null, user);
});

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/app',
    failureRedirect: '/'
}))

router.get('/instagram', passport.authenticate('instagram'));
router.get('/instagram/callback', passport.authenticate('instagram', {
    successRedirect: '/app',
    failureRedirect: '/'
}))

router.get('/google', passport.authenticate('google'));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/app',
    failureRedirect: '/'
}))

router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/app',
    failureRedirect: '/'
}))

router.get('/linkedin', passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));
router.get('/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: '/app',
    failureRedirect: '/'
}))

router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/app',
    failureRedirect: '/'
}))

export default router
