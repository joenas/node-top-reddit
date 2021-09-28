FROM node:14-slim
RUN mkdir -p /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV PORT=5000
ENV NODE_ENV=production

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --silent --frozen-lockfile

COPY ["Procfile", "./"]
COPY ["src/", "./src"]

EXPOSE 5000
CMD [ "yarn", "start" ]
