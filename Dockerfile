FROM node:8-alpine

# Update OS
RUN apk --no-cache add ca-certificates wget git python alpine-sdk libusb-dev && update-ca-certificates

# Install yarn
RUN mkdir -p /opt/yarn && cd /opt/yarn && wget https://yarnpkg.com/latest.tar.gz && mkdir dist && tar zxf latest.tar.gz -C dist --strip-components 1
ENV PATH "$PATH:/opt/yarn/dist/bin"

# Create the working dir
RUN mkdir -p /opt/app && mkdir /cache
WORKDIR /opt/app

# Do not use cache when we change node dependencies in package.json
ADD package.json yarn.lock /cache/

# Install packages + Prepare cache file
RUN cd /cache \
  && yarn config set cache-folder /usr/local/share/.cache/yarn \
  && yarn \
  && yarn global add forever \
  && cd /opt/app && ln -s /cache/node_modules node_modules \
  && tar czf /.yarn-cache.tgz /usr/local/share/.cache/yarn

COPY . /opt/app

RUN yarn
RUN NODE_PATH=src/ yarn run build

EXPOSE 3000
CMD ["forever", "./server.js"]
