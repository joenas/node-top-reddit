require('dotenv').config();
const logger = require('./logger')('cli');
const fetchFeeds = require('./fetch-feeds');

logger.info("Triggering 'Fetch feeds'");
(async () => {
  await fetchFeeds();
  process.exit(0);
})();
