export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = error.name === "CastError" ? "Resource not found" : error.message;

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
};
