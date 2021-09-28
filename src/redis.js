const redis = require('redis');
const logger = require('./logger')('redis');

module.exports = async () => {
  const client = redis.createClient({ url: process.env.REDIS_URL });

  client.on('error', (err) => {
    logger.error(err);
    process.exit(1);
  });
  await client.connect();

  return {
    exists: async (key, value) => {
      return client.SISMEMBER(key, value);
    },
    add: async (key, value) => {
      return client.SADD(key, value);
    },
  };
};
