// middlewares/checkAdmin.js
module.exports = function checkAdmin(req, res, next) {
  if (req.user && req.user.isAdmin === true) {
    next(); // continue to route handler
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
