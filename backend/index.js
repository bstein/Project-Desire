import 'dotenv/config';
import { json, urlencoded } from 'body-parser';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import models from './models';
import routes from './routes';

const passportConfig = require('./passport-config');

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
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use((req, _res, next) => {
    // Store models data within the request
    req.models = models;
    next();
  });

  // Prepare EJS to render templates under ./views
  app.set('view engine', 'ejs');

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Store session information in MongoDB database
  app.use(session({
    secret: process.env.SESSIONS_SECRET_KEY,
    saveUninitialized: false, // Don't save session if no other data has been changed
    resave: false, // Don't save session if unmodified (note: expiration time will still be updated)
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: process.env.SESSIONS_TTL,
    }),
  }));

  // Mount URI routes
  app.use('/api/addresses', routes.addresses);
  app.use('/auth', routes.auth);

  // Finally, begin listening with Express.js
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`App listening on port ${process.env.SERVER_PORT}`);
  });
});
