import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user';

const router = Router();

// Log in - verify the posted token with Google and respond with a status code
router.post('/api/login', async (req, res) => {
  let errorThrown = false;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  // Verify token with Google
  const ticket = await client.verifyIdToken({
    idToken: req.body.idtoken,
    audience: `${process.env.GOOGLE_CLIENT_ID}.apps.googleusercontent.com`,
  }).catch((err) => {
    console.error(`Couldn't verify token with Google - ${err}`);
    errorThrown = true;
    res.sendStatus(403);
  });

  let payload;
  if (!errorThrown) {
    // Extract Google's response payload
    try {
      payload = ticket.getPayload();
    } catch (err) {
      console.error(`Couldn't get payload - ${err}`);
      errorThrown = true;
      res.sendStatus(502);
    }
  }

  // Verify token is for intended for this app
  if (!errorThrown && payload.aud !== `${process.env.GOOGLE_CLIENT_ID}.apps.googleusercontent.com`) {
    console.error(`payload.aud ( ${payload.aud} ) !== ${process.env.GOOGLE_CLIENT_ID}.apps.googleusercontent.com`);
    errorThrown = true;
    res.sendStatus(403);
  }

  if (!errorThrown) {
    // Establish session authentication
    try {
      // Set values for user
      const values = { name: payload.name, email: payload.email, pictureURL: '' };
      if ('picture' in payload) {
        values.pictureURL = payload.picture;
      }

      // Query database to check if there is no admin
      const admin = await User.findOne({ isAdmin: true }, {});
      if (!admin) {
        console.log(`No admin found. Giving admin privileges to ${payload.sub} (${values.email})`);
        values.isAdmin = true;
      }

      // Query database with userID, update existing values or upsert (new insert)
      const user = await User.findOneAndUpdate(
        { userID: payload.sub },
        values,
        { new: true, upsert: true },
      );

      // eslint-disable-next-line no-underscore-dangle
      req.session.user_id = user._id;
      res.locals.user = user;
      res.locals.authenticated = true;

      // Send status code based on new or existing user
      if (!user.defaultAddress) {
        res.sendStatus(201); // Does not have default address -> new
      } else {
        res.sendStatus(200); // Has default address -> existing
      }
    } catch (err) {
      console.error(`Couldn't create authenticated session - ${err}`);
      res.sendStatus(500);
    }
  }
});

// Logout - clear session
router.post('/api/logout', (req, res) => {
  res.locals.authenticated = false;
  res.locals.user = null;
  req.session.destroy(() => {
    res.sendStatus(200);
  });
});

export default router;
