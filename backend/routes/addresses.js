import { Router } from 'express';
import models from '../models';

const router = Router();

// GET a sorted list (by addressName) of saved addresses from the database
router.get('/', async (req, res) => {
  // Accepted URI parameters
  // owner = owner || all (default)

  // Prepare database find() conditions based on parameters
  const conditions = { };

  // Limit by owner
  if (req.query.owner) {
    conditions.owner = req.query.owner;
  }

  // If logged in user is not an admin and they're requesting other owner's addresses,
  //  then only send public addresses
  // eslint-disable-next-line no-underscore-dangle
  if (!res.locals.user.isAdmin && req.query.owner !== res.locals.user._id) {
    conditions.isPublic = true;
  }

  // Retrieve addresses from database
  const addresses = await models.Address.find(conditions).sort({ addressName: 1 });
  res.send(addresses);
});

export default router;
