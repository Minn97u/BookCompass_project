const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/userSchema');

module.exports = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email, 
        $or: [
            {isDeleted: false},
            {isDeleted: { $exists: false }}
          ]})
        .then(user => {
            if (!user) {
                // 사용자 ID가 존재하지 않음
                return done(null, false, { message: 'Email or password is incorrect' });
            }
            if (user.password === null) {
                return done(null, false, { message: 'Please use Social login.' });
            }

            // 비밀번호 비교
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    // 비밀번호가 맞으면 사용자 반환
                    return done(null, user);
                } else {
                    // 비밀번호가 틀림
                    return done(null, false, { message: 'Email or password is incorrect' });
                }
            });
        })
        .catch(err => console.log(err));
});