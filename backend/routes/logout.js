import { Router } from 'express';

const router = Router();

// Clear session
router.post('/api/logout', (req, res) => {
  res.locals.authenticated = false;
  res.locals.user = null;
  req.session.destroy(() => {
    res.sendStatus(200);
  });
});

export default router;
