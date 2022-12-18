FROM node:16.13.2

EXPOSE 3000

WORKDIR /app

COPY . .

RUN npm install

CMD [ "npm", "run","start:dev"]
