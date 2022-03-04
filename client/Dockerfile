FROM node:14-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN yarn

COPY . .

CMD ["yarn", "dev"]

