const pino = require('pino');

module.exports = (name) =>
  pino({
    name,
  });
