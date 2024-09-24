FROM node:18-alpine

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install
RUN yarn add bcrypt --build-from-source

COPY . .

RUN yarn build

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 5001

ENTRYPOINT ["./docker-entrypoint.sh"]
