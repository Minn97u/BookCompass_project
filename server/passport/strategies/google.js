const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/userSchema');

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
// clientID와 clientSecret이 제대로 설정되었는지 확인합니다.
if (!clientID || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET 환경 변수가 필요합니다.');
  }

const googleStrategy = new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: 'http://localhost:3001/api/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if(!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                user.googleId = profile.id;
                await user.save();
            } else {
                user = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    profilePic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
                    // 다른 필요한 필드들
                });
                await user.save();
            }
        } 

        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
});

passport.use(googleStrategy);

module.exports = googleStrategy;