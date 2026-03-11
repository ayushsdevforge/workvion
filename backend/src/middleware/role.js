/**
 * Role-based access control
 * Usage: role("admin") or role("employee", "admin")
 * Returns 403 if the user's role isn't in the allowed list.
 */
const role = (...allowed) => (req, res, next) => {
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};

export default role;
