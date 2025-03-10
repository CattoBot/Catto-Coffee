FROM node:20-alpine
RUN set -ex; \
    apk update; \
    apk add --no-cache \
    openssl \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    librsvg-dev \
    python3 \
    py3-pip
ENV PYTHON=/usr/bin/python3
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3003
CMD ["sh", "-c", "npx prisma db push && npm run start"]
