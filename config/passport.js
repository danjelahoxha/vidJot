const LocalStrategy = require('passport-local').Strategy;
const mongose = require('mongoose');
const bcrypt = require('bcryptjs');

/// lets load user model

const User = mongose.model('users');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' },
            (email, password, done) => {
                User.findOne({
                    email: email
                }).then(user => {
                    console.log(user);
                    if (!user) {
                        return done(null, false, { message: 'no user found' });
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Passord incorrect' })
                        }
                    })

                })
                //console.log(email);
            }

        ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}