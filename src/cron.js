require('dotenv').config();
const { CronJob } = require('cron');
const fetch = require('node-fetch');
const logger = require('./logger')('cron');
const fetchFeeds = require('./fetch-feeds');

// Feeds
// eslint-disable-next-line no-new
new CronJob(
  '*/15 * * * *',
  // '*/1 * * * *',
  async function () {
    logger.info("Triggering 'Fetch feeds'");
    await fetchFeeds();
    const url = process.env.PING_URL_CRON;
    if (url) await fetch(url);
  },
  null, // onComplete
  true, // start
  process.env.TZ,
  null, // context
  false, // RunOnInit
);
