FROM  node:dubnium-alpine

# RUN yarn global add @quasar/cli
RUN echo "==> Install quasar cli" && \
    yarn global add @quasar/cli

RUN mkdir -p /usr/src/
# COPY . /usr/src/
# COPY package.json /usr/src/
RUN echo "==> Copy file" && \
    COPY . /usr/src/ && \
    COPY package.json /usr/src/ 
    
WORKDIR /usr/src/

RUN echo "==> Install & Build" && \
    yarn install && \
    yarn build
# RUN yarn install
# RUN yarn build

WORKDIR /usr/src/dist/ssr

CMD yarn start
