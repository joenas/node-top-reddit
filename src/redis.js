const redis = require('redis');
const logger = require('./logger')('redis');

module.exports = async () => {
  /**
   * Remove username because our combination of redis and node-redis
   * doesn't support it. https://stackoverflow.com/a/67617609
   */
  const { protocol, password, host } = new URL(process.env.REDIS_URL);
  const parsedUrl = `${protocol}//:${password}@${host}`;
  const client = redis.createClient({ url: parsedUrl });

  client.on('error', (err) => {
    logger.error(err);
    process.exit(1);
  });
  await client.connect();

  return {
    exists: async (key, value) => client.SISMEMBER(key, value),
    add: async (key, value) => client.SADD(key, value),
  };
};
