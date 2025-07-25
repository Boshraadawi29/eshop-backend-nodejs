const { expressjwt: expressJWT } = require('express-jwt');

function authJWT() {
    // const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL;
    return expressJWT({
      secret: process.env.JWT_SECRET,
      algorithms: ['HS256'],
      requestProperty: 'user',
      // isRevoked: isRevoked,
    }).unless({
      path: [
        { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
        `${api}/users/login`,
        `${api}/users/register`,
      ],
    });
}

module.exports = authJWT;
