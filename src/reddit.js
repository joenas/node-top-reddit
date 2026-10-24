const fetch = require('node-fetch');
const { version } = require('../package.json');
const request = require('./request');

/**
 * Reddit blocks anonymous requests to the .json endpoints, so we use
 * app-only OAuth (client credentials) against oauth.reddit.com.
 * https://github.com/reddit-archive/reddit/wiki/OAuth2
 */

const TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';
const userAgent = () =>
  process.env.REDDIT_USER_AGENT || `nodejs:node-top-reddit:v${version}`;

let token = null;

const fetchToken = async () => {
  const { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET } = process.env;
  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
    throw new Error('REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET must be set');
  }
  const auth = Buffer.from(
    `${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`,
  ).toString('base64');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
    headers: { authorization: `Basic ${auth}`, 'user-agent': userAgent() },
  });
  if (!res.ok) {
    throw new Error(
      `Reddit token request failed: ${res.status} ${res.statusText}`,
    );
  }
  const { access_token: accessToken, expires_in: expiresIn } = await res.json();
  // Refresh a minute early
  return { accessToken, expiresAt: Date.now() + (expiresIn - 60) * 1000 };
};

/** Share one in-flight token request between concurrent feeds */
const getToken = async () => {
  if (!token || (await token).expiresAt < Date.now()) {
    token = fetchToken().catch((e) => {
      token = null;
      throw e;
    });
  }
  return (await token).accessToken;
};

/** https://www.reddit.com/r/x.json?limit=5 -> https://oauth.reddit.com/r/x?limit=5 */
const toOauthUrl = (url) => {
  const uri = new URL(url);
  uri.hostname = 'oauth.reddit.com';
  uri.pathname = uri.pathname.replace(/\.json$/, '');
  return uri.toString();
};

const get = async (url) =>
  request(toOauthUrl(url), {
    headers: {
      authorization: `Bearer ${await getToken()}`,
      'user-agent': userAgent(),
    },
  });

module.exports = { get, toOauthUrl };
