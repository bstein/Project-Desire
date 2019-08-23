/* eslint-disable no-underscore-dangle */
import { Router } from 'express';
import models from '../models';

const router = Router();

// GET a sorted list (by addressName) of saved addresses from the database
router.get('/', async (req, res) => {
  // Accepted URI parameters
  // scope = normal (default) || privileged
  // owner = owner || all (default)

  // Prepare database find() conditions based on parameters
  const conditions = { };

  // Limit by owner
  if (req.query.owner) {
    conditions.owner = req.query.owner;
  }

  // logged in user is not owner
  // AND
  //  scope is not privileged
  //  OR
  //  logged in user is not an admin
  if (req.query.owner.toString() !== res.locals.user._id.toString()
      && (req.query.scope !== 'privileged'
          || !res.locals.user.isAdmin)) {
    // Limit results to public addresses
    conditions.isPublic = true;
  }

  // Retrieve addresses from database
  const addresses = await models.Address.find(conditions).sort({ addressName: 1 });
  res.send(addresses);
});

export default router;
