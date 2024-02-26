FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD sleep 20 && npx prisma generate && npx prisma migrate dev -n init && npm start

