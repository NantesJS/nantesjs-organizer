FROM node:12-alpine

ENV NODE_ENV production

RUN apk add --no-cache tini=0.18.0-r0

ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /usr/local/src/nantesjs-organizer

COPY package.json package-lock.json ./

RUN npm ci

COPY src/ src/

CMD ["node", "-r", "dotenv/config", "src/index.js"]
