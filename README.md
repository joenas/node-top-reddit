# Top Reddit

Fetch Reddit feeds, pick posts matching your desired amount of upvotes, filter out duplicates and post a webhook (currently compatible with [matrix-appservice-webhooks](https://github.com/turt2live/matrix-appservice-webhooks/)).

All the jobs will currently run at a 15 minute interval.

## Getting started

### Install dependencies

```bash
yarn install
```

### Set up environment variables

```bash
cp .env.example .env
# edit file
```

### Configuration

```yaml
- name: 'worldnews'
  url: 'https://www.reddit.com/r/worldnews.json?limit=1'
  minCount: 15
  webhookUrl: 'https://example.com'
  displayName: WorldNews
```

There's an example file available

```bash
cp config/reddit.yml.example config/reddit.yml
```

### Start server

```bash
yarn dev
```

### Docker

To test the Dockerfile you need to build the image. Also make sure the database is up (`docker-compose up -d`)

```bash
docker build -t top-reddit .
```

If you changed any of the entries in `.env` you might have to change them here as well.

```bash
docker run --rm \
    -e NODE_ENV=development \
    -e TZ=Europe/Stockholm \
    -e REDIS_URL=redis://localhost:6379 \
    top-reddit
```

### Dokku

The app is prepared to deploy with dokku. The config file can be mounted with [persistant storage](https://github.com/dokku/dokku/blob/master/docs/advanced-usage/persistent-storage.md#usage).
Since we're using a Dockerfile you also need to go through [these steps](https://github.com/dokku/dokku-letsencrypt#dockerfile-deploys).

### TODO

- [ ] webhook templates
- [ ] cron schedule in config
- [ ] other integrations?
