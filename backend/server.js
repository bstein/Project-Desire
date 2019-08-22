import 'dotenv/config';
import { json, urlencoded } from 'body-parser';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import cors from 'cors';
import routes from './routes';
import User from './models/user';

const MongoStore = connectMongo(session);

// Intialize MongoDB connection
// Avoid deprecated options
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// Handle any errors when attempting to connect to the database
mongoose.connection.on('error', (err) => {
  console.error(`Failed to connect to MongoDB server | ${err}`);
});

// Asynchronously attempt to connect to the database
mongoose.connect(process.env.DB_URI).then(() => {
  // Initialize Express.js app
  const app = express();

  // Enable CORS requests from frontend
  app.use(cors({
    origin: [`${process.env.FRONTEND_URI}${process.env.FRONTEND_PORT}`],
    credentials: true,
  }));

  // Parse incoming JSON and URL-encoded/form data
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Store session information in MongoDB database
  app.use(session({
    secret: process.env.SESSIONS_SECRET_KEY,
    saveUninitialized: false, // Don't save session if no other data has been changed
    resave: false, // Don't save session if unmodified (note: expiration time will still be updated)
    secure: 'auto', // Set cookie to be secure if HTTPS (production), otherwise set it to be not secure (debugging)
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: process.env.SESSIONS_TTL,
    }),
  }));

  // Mount non-privileged URI routes
  app.use('/', routes.auth);

  // Middleware that authenticates users for *ALL* following routes
  app.use(async (req, res, next) => {
    // Default (non-authenticated user)
    res.locals.authenticated = false;

    if (!req.session.user_id) {
      // No session data, user hasn't logged in yet
      res.sendStatus(401);
    } else {
      // Query the db with the user_id from the session cookie
      const user = await User.findById({ _id: escape(req.session.user_id) });

      if (user) {
        // User exists in the 'users' database
        res.locals.user = user;
        res.locals.authenticated = true;
        next();
      } else {
        // User doesn't exist; likely deleted!
        res.sendStatus(403);
      }
    }
  });

  // Mount privileged URI routes
  app.use('/api/status', routes.status);
  app.use('/api/users', routes.users);
  app.use('/api/addresses', routes.addresses);
  app.get('/api/username', async (req, res) => {
    res.send(`Hello <strong>${res.locals.user.name}</strong>!`);
  });

  // Finally, begin listening with Express.js
  app.listen(process.env.BACKEND_PORT, () => {
    console.log(`App listening on port ${process.env.BACKEND_PORT}`);
  });
}); // TODO - catch if db connection failed
