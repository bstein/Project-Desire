import { Router } from 'express';

const router = Router();

// Render account detail / settings page
router.get('/account', (req, res) => {
  res.render('account', { GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID });
});

// Clear session
router.post('/logout', (req, res) => {
  res.locals.authenticated = false;
  res.locals.user = null;
  req.session.destroy(() => {
    res.sendStatus(200);
  });
});

export default router;
