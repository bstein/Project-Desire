import { Router } from 'express';

const router = Router();

// GET a list of saved addresses from the database
router.get('/', async (req, res) => {
  // Determine the scope of which addresses to retrieve (public or owners)
  // Assume public if not provided in the URL
  const scope = req.query.scope ? req.query.scope : 'public';

  // Prepare database find() conditions based on scope
  let conditions = {};
  if (scope === 'public') {
    conditions = { isPublic: true, isSaved: true };
  } else {
    // TODO: add condition to limit results to those owned by currently authenticated user
    conditions = { isSaved: true };
  }

  // Retrieve addresses from database
  const addresses = await req.models.Address.find(conditions);
  return res.send(addresses);
});

export default router;
