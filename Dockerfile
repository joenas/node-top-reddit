FROM node:14-slim
RUN mkdir -p /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --silent --frozen-lockfile

COPY ["Procfile", "./"]
COPY ["src/", "./src"]

CMD [ "yarn", "start" ]
