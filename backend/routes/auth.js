import { Router } from 'express';
import passport from 'passport';

const router = Router();

// TODO - new login page
router.get('/login-new', (req, res) => {
  
  return res.send('placeholder for logout page!!!');
});

// TODO - replace this old login approach
router.get('/login',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// TODO - authentication action
router.get('/',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    // Successful authentication, redirect for debug purpose
    // TODO - implement meaningful redirect
    res.redirect('/#authenticatedDEBUG');
  });

// TODO - logout action
router.get('/logout', (req, res) => {
  console.log("logout page visited");
  return res.send('placeholder for logout page!!!');
});

export default router;
