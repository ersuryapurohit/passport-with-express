import express from 'express';
const router = express.Router();
import passport from 'passport';

/* GET home page. */
router.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/app');
    } else {
        res.render('login', { user: req.user });
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/app', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
}));

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/app', // redirect to the secure profile section
    failureRedirect: '/'
}));

router.get('/app', (req, res, next) => {
    res.render('index', { title: 'Login' });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

export default router;
