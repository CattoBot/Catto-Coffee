FROM node:20-alpine

# Install system dependencies needed for `canvas` and `node-gyp`
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

# Set Python for node-gyp
ENV PYTHON=/usr/bin/python3

WORKDIR /app

# Copy package files first (to optimize Docker caching)
COPY package*.json ./

# Ensure npm cache is clean and install dependencies
RUN npm cache clean --force && npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3003

# Ensure Prisma migrations are applied and then start the app
CMD ["sh", "-c", "npx prisma db push && npm run start"]
