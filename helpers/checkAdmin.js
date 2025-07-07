// middlewares/checkAdmin.js
module.exports = function checkAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next(); // allowed
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
