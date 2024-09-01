FROM node:20.17.0-alpine

RUN mkdir -p /home/node/app/server/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app/server
COPY --chown=node:node ./server/package*.json ./

USER node

RUN npm install
COPY --chown=node:node . ..

EXPOSE 3000

CMD [ "node", "index.js" ]
