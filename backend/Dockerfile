FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY . .

EXPOSE 3000

CMD [ "yarn", "start:dev" ]
