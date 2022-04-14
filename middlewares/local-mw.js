module.exports = (req, res, next) => {
  res.locals.user = req.session && req.session.user ? req.session.user : {};
  next();
}