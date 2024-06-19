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
      // 먼저 googleId로 사용자를 찾고, 없다면 email로 찾습니다.
      let user = await User.findOne({
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value },
        ],
      });

      if (user) {
        // isDeleted가 true이면 로그인 불가
        if (user.isDeleted) {
          return done(null, false, { message: 'This account has been deleted.' });
        }

        // 기존 사용자가 있고 googleId가 없으면 업데이트
        if (!user.googleId) {
          user.googleId = profile.id;
        }
        user.googleAccessToken = accessToken;
        await user.save();
      } else {
        // 새로운 사용자 생성
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePic:
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : null,
          googleAccessToken: accessToken,
        });
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);

module.exports = googleStrategy;

passport.use(googleStrategy);

module.exports = googleStrategy;
