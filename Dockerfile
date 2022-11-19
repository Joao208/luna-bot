FROM node:16-bullseye as ts-compiler

WORKDIR /usr/app

COPY package*.json ./

COPY tsconfig*.json ./

RUN yarn

COPY . ./

RUN npx prisma generate

RUN yarn build

FROM node:16-bullseye as ts-remover

WORKDIR /usr/app

COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/prisma ./
COPY --from=ts-compiler /usr/app/dist ./

# Run when test local
# COPY --from=ts-compiler /usr/app/.env ./

RUN yarn install --prod

RUN npx prisma generate

FROM node:16-bullseye

RUN apt update \
    && apt install -y \
    bzip2 \
    build-essential \
    chrpath \
    libssl-dev \
    libxft-dev

WORKDIR /usr/app

COPY --from=ts-remover /usr/app ./

EXPOSE 5003

CMD ["yarn", ,"start"]