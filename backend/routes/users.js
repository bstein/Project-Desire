import { Router } from 'express';
import models from '../models';

const router = Router();

// GET a sorted list (by name) of saved users from the database
router.get('/', async (req, res) => {
  const users = await models.User.find().sort({ name: 1 });
  res.send(users);
});

export default router;
