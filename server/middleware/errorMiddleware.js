const errorHandler = (err, req, res, next) => {
  // If the status code is still 200, change it to 500 for an actual error
  const statusCode = res.statusCode === 200 ? 500 : (res.statusCode || 500);

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
