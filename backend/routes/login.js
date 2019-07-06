import { Router } from 'express';

const router = Router();

// GET a list of saved addresses from the database
router.get('/', (req, res) => {
  return res.send('placeholder for login!!!');
});

export default router;
