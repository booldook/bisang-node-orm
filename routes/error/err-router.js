module.exports = (err, req, res, next) => {
  const {status = 500, message = 'Unknown Error'} = err;
  res.send(`
  <h1>Error</h1>
  <hr>
  <h2>${status}</h2>
  <h3>${message}</h3>
  `);
}