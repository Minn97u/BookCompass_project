const passport = require('passport');
const localStrategy = require('./strategies/local');
require('./strategies/google');  // Google OAuth 전략 불러오기

const User = require('../models/userSchema');

passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;