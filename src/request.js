const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');

/**
 * Move to proper shared for client and server?
 */

const parseJSON = (response) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
};

const checkStatus = (response) => {
  const { status, statusText } = response;
  /** Return response for validation errors as well */
  if ((status >= 200 && status < 300) || status === 400) {
    return response;
  }
  const error = new Error(statusText);
  error.response = response;
  throw error;
};

const request = (url, options = {}) => {
  const uri = new URL(url);
  if (options.params) {
    uri.search = new URLSearchParams(options.params).toString();
  }
  return fetch(uri, {
    ...options,
    headers: { 'content-type': 'application/json' },
  })
    .then(checkStatus)
    .then(parseJSON);
};

module.exports = request;
module.exports.checkStatus = checkStatus;
