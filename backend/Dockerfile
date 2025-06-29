FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000