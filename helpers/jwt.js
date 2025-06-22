const expressJWT = require('express-jwt');

function authJWT() {
  // const secret = process.env.JWT_SECRET;
  return expressJWT({
    secret: (req, payload, done) => {
      done(null, process.env.JWT_SECRET);
    },
    algorithms: ['HS256'],
  });
}

module.exports = authJWT;
