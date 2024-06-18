const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/userSchema');

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const clientUrl = process.env.NODE_ENV === "development" 
      ? "http://localhost:3000" 
      : process.env.CORS_ORIGIN;
if (!clientID || !clientSecret) {
  throw new Error(
    'GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET 환경 변수가 필요합니다.'
  );
}

const googleStrategy = new GoogleStrategy(
  {
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: `${clientUrl}/api/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          user.googleAccessToken = accessToken;
          user.googleRefreshToken = refreshToken;
          await user.save();
        } else {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : null,
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken
          });
          await user.save();
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);

passport.use(googleStrategy);

module.exports = googleStrategy;
