FROM node:24.14.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY httpconfig.js ./
COPY static/ ./static/

ENV PORT=9000
EXPOSE 9000

USER node

CMD ["node", "httpconfig.js"]
