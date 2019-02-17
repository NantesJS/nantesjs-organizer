FROM node:10-alpine

ENV NODE_ENV production

RUN apk add --no-cache tini=0.16.1-r0

ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /usr/local/nantesjs-organizer

COPY package.json package-lock.json ./

RUN npm ci

COPY src/ src/

CMD ["node", "src/index.js"]
