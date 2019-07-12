import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/user';

// Save user id in session
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

// Retrieve user data stored in database
passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});

// Configure Passport to use the Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK,
  accessType: 'offline',
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
}, async (accessToken, refreshToken, profile, cb) => {
  // Set values for user
  const values = { isAdmin: false, name: profile.displayName, email: profile.emails[0].value };

  // Query database with googleID, update or upsert values
  const user = await User.findOneAndUpdate(
    { googleID: profile.id },
    values,
    { new: true, upsert: true },
  );

  console.log(`user is: ${user}`);
  cb(null, user);
}));
