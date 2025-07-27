const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userSchema");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

function initializeGmailAuth(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({
            email: profile.emails[0].value,
          });
          if (existingUser) {
            return done(null, existingUser);
          }
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await newUser.save();
          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  // wird aufgerufen wenn ein user Erfolgreich Authen. Es wird Entschieden was genau in der session gespeichert wird.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // wird bei jeder nachfolgenden Anfrage aufgerufen, um aus dem gespeicherten Wert (z. B. der ID) wieder den kompletten User aus der Datenbank zu laden.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

module.exports = initializeGmailAuth;
