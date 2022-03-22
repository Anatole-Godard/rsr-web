FROM node:lts-alpine
WORKDIR usr/src/app

RUN apk --no-cache add --virtual builds-deps build-base python3

COPY package.json .
RUN yarn install

COPY . .

CMD ["yarn", "dev"]
