import express from 'express';
import passport from 'passport';
import { home, signUp, signout, createSession, createAccount } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', home);
router.get('/sign-up', signUp);
router.get('/signout', signout);

router.post('/create-session', 
    passport.authenticate('local', { 
        failureRedirect: '/' ,
        failureFlash: true
    }),
    createSession
);

router.post('/create-account', createAccount);

export default router;
