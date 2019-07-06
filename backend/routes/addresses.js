import { Router } from 'express';

const router = Router();

// GET a list of saved addresses from the database
router.get('/', (req, res) => {
  const addresses = ['foo'];
  return res.send(addresses);
});

export default router;
