// backend/middleware/roleCheck.js
module.exports = function roleCheck(requiredRole) {
  return function(req, res, next) {
    if (!req.user?.role) return res.status(403).json({ error: "No role assigned" });
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: `Requires ${requiredRole} privileges` });
    }
    next();
  };
};