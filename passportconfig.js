/**
 *
 * @type {Auth configuration {Strategy, ExtractJwt}|*}
 */
const ppjwt = require("passport-jwt");
const Strategy = ppjwt.Strategy;
const ExtractJWT = ppjwt.ExtractJwt;
const UserServices = require('./Applications/UserManagement/User/user.service')
const config = require("./Helpers/config.helper");

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
};

module.exports = (passport) => {
  passport.use(
    new Strategy(opts, (payload, done) => {
      UserServices.getById(payload.id)
        .then((user) => {
          if (user) {
            return done(null, {
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username,
            });
          }
          return done(null, false);
        })
        .catch((err) => {
          console.error(err);
        });
    })
  );
};
