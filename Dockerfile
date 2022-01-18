FROM node:lts-alpine
RUN mkdir /app
WORKDIR /app

RUN apk --no-cache add --virtual builds-deps build-base python3

COPY package.json .
RUN yarn install

COPY . .

CMD ["yarn", "dev"]
