const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/userSchema');

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                // 다른 필요한 필드들
            });
            await user.save();
        }
        if (user.region === null || user.favoriteAuthor === null) {
            return done(null, user, { needAdditionalInfo: true });
        }
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
});

passport.use(googleStrategy);

module.exports = googleStrategy;