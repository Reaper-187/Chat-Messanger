const GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/userSchema");

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

function initializeGithubAuth(passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || null;

          const existingUser = await User.findOne({ email });

          if (existingUser) {
            return done(null, existingUser);
          }
          const newUser = new User({
            githubId: profile.id,
            name: profile.displayName || profile.username || "GitHub User",
            email,
          });
          await newUser.save();
          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

module.exports = initializeGithubAuth;
