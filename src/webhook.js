const logger = require('./logger')('webhook');
const request = require('./request');

const webhook = async ({ url, body }) => {
  try {
    const res = await request(url, {
      body: JSON.stringify(body),
      method: 'POST',
    });
    return res;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports = webhook;
