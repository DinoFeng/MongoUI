FROM  node:dubnium-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
    
RUN yarn global add @quasar/cli

RUN mkdir -p /usr/src/
COPY . /usr/src/
COPY package.json /usr/src/
    
WORKDIR /usr/src/

RUN yarn install
RUN yarn build

WORKDIR /usr/src/dist/ssr

CMD yarn start
