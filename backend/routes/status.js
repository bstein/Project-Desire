import { Router } from 'express';

const router = Router();

// Send status that the user is logged in
// This is a priveleged route, so there's already a 403 if not logged in
router.get('/', (req, res) => {
  res.sendStatus(200);
});

export default router;
