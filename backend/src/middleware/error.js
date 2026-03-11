// 404 handler – no route matched
export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

/**
 * Global error handler
 * Catches all errors forwarded via next(err) and returns
 * a consistent JSON response with the appropriate status code.
 */
export const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;

  // Duplicate key (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `Duplicate value for '${field}'` });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ success: false, message: msg });
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  // Log in dev for debugging
  if (process.env.NODE_ENV === "development") console.error(err);

  res.status(status).json({ success: false, message: err.message || "Internal server error" });
};
