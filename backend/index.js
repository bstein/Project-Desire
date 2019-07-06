import 'dotenv/config';
import { json, urlencoded } from 'body-parser';
import express from 'express';

import models, { connectMon } from './models';
import routes from './routes';

// Initialize Express.js app and set up middleware
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use((req, _res, next) => {
  // Store models data within the request
  req.models = models;
  next();
});

// TODO: Handle user authentication

// Mount URI routes
app.use('/api/addresses', routes.addresses);
app.use('/login', routes.login);

// Connect to database and then start Express.js server
connectMon().then(() => {
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`App listening on port ${process.env.SERVER_PORT}`);
  });
});
