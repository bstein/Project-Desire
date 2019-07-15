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

// Finally, asynchronously attempt to connect to the database
mongoose.connect(process.env.DB_URI).then(() => {
  // Initialize Express.js app
  const app = express();
  app.set('view engine', 'ejs');

  // Enable all CORS requests in debug mode
  if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
  }

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
  app.use('/', routes.login);

  // Middleware that authenticates users for *ALL* following routes
  app.use(async (req, res, next) => {
    if (req.session.user_id) {
      res.locals.user = await User.findById({ _id: req.session.user_id });
      res.locals.authenticated = true;
      next();
    } else {
      res.locals.authenticated = false;
      res.redirect('/login');
    }
  });

  // Mount privileged URI routes
  app.use('/api/addresses', routes.addresses);
  app.use('/', routes.account);
  app.get('/', async (req, res) => {
    res.send(`Hello <strong>${res.locals.user.name}</strong>!`);
  });

  // Finally, begin listening with Express.js
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`App listening on port ${process.env.SERVER_PORT}`);
  });
});
