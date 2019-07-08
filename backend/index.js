import 'dotenv/config';
import { json, urlencoded } from 'body-parser';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import models from './models';
import routes from './routes';

const MongoStore = connectMongo(session);

// Intialize MongoDB connection
// Avoid using deprecated ensureIndex by using useCreateIndex instead
mongoose.set('useCreateIndex', true);

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

  // Store session information in MongoDB database
  app.use(session({
    secret: process.env.SESSIONS_SECRET_KEY,
    saveUninitialized: true, // Save session, even if no other data has been changed
    resave: false, // Don't save session if unmodified; expiration time will still be updated
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      // ttl: 7776000, // 90 * 24 * 60 * 60 = 90 Days
      ttl: 60, // 1 * 60 = 1 minute FOR DEBUG ONLY (TODO: update this)
    }),
  }));

  // Mount URI routes
  app.use('/api/addresses', routes.addresses);
  app.use('/login', routes.login);

  // Finally, begin listening with Express.js
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`App listening on port ${process.env.SERVER_PORT}`);
  });
});
