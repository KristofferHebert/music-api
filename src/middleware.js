const errorLogger = (err, req, res, next) => {
  res.status(err.status || 400).send({ errorMessage: err.message });
};

const validToken = (err, req, res, next) => {
  // Valid token
  // if(!req.get('authorization') || !isValidToken(req.get('authorization'))){
  //     next(new Error('Please provide Authorization token'))
  // }
  // next()
  next();
};

const rateLimiter = (err, req, res, next) => {};

export { errorLogger, rateLimiter, validToken };
