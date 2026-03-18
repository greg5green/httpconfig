FROM node:24.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY static/scss/ ./static/scss/
RUN npm run build

FROM node:24.14.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY httpconfig.js ./
COPY static/html/ ./static/html/
COPY static/js/ ./static/js/
COPY --from=builder /app/static/css/ ./static/css/

ENV PORT=9000
EXPOSE 9000

USER node

CMD ["node", "httpconfig.js"]
