const fs = require('fs');
const YAML = require('yaml');
const request = require('./request');
const redis = require('./redis');
const webhook = require('./webhook');

const matchingPosts = async (url, minCount) => {
  const res = await request(url);
  const posts = res.data.children;
  return posts.filter((p) => p.data.score >= minCount).map((p) => p.data);
};

const postWebhook = async (webhookUrl, displayName, post) => {
  const { url, title, permalink } = post;
  const body = {
    text: `<a href='${url}'>${title}</a> (<a href='https://www.reddit.com${permalink}'>comments</a>)`,
    format: 'html',
    displayName: displayName || 'Reddit',
    // avatarUrl: "",
    msgtype: 'notice',
  };
  await webhook({ url: webhookUrl, body });
};

const fetchFeeds = async () => {
  const cache = await redis();
  const configs = YAML.parse(fs.readFileSync('./config/reddit.yml', 'utf8'));

  configs.forEach(async (conf) => {
    const { name, url, minCount, displayName, webhookUrl } = conf;
    const posts = await matchingPosts(url, minCount);
    posts.forEach(async (post) => {
      const exists = await cache.exists(name, post.url);
      if (exists) return;
      await cache.add(name, post.url);
      await postWebhook(webhookUrl, displayName, post);
    });
  });
};

module.exports = fetchFeeds;
