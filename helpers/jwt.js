const { expressjwt: expressJWT } = require('express-jwt');

function authJWT() {
  // const secret = process.env.JWT_SECRET;
  return expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
  }).unless({
    path: [
      '/api/v1/users/login',
      '/api/v1/users/register'
    ]
  })
}

module.exports = authJWT;
