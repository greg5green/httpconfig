FROM node:24.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY static/scss/ ./static/scss/
COPY httpconfig.ts tsconfig.json ./
RUN npm run build

FROM node:24.14.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist/httpconfig.js ./httpconfig.js
COPY static/html/ ./static/html/
COPY static/js/ ./static/js/
COPY --from=builder /app/static/css/ ./static/css/

ENV PORT=9000
EXPOSE 9000

USER node

CMD ["node", "httpconfig.js"]
