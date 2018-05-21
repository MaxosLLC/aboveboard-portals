FROM node:8-alpine

# Update OS
RUN apk --no-cache add ca-certificates wget git python alpine-sdk libusb-dev yarn && update-ca-certificates

# From https://github.com/Zenika/alpine-chrome/blob/master/Dockerfile

# Update apk repositories
RUN echo "http://dl-2.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories
RUN echo "http://dl-2.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
RUN echo "http://dl-2.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

# Install chromium
RUN apk -U --no-cache \
  --allow-untrusted add \
  zlib-dev \
  chromium \
  freetype-dev \
  xvfb \
  wait4ports \
  xorg-server \
  dbus \
  ttf-freefont \
  mesa-dri-swrast \
  grep \
  udev \
  && apk del --purge --force linux-headers binutils-gold gnupg zlib-dev libc-utils \
  && rm -rf /var/lib/apt/lists/* \
  /var/cache/apk/* \
  /usr/share/man \
  /tmp/* \
  /usr/lib/node_modules/npm/man \
  /usr/lib/node_modules/npm/doc \
  /usr/lib/node_modules/npm/html \
  /usr/lib/node_modules/npm/scripts

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

# Install yarn
# RUN mkdir -p /opt/yarn && cd /opt/yarn && wget https://yarnpkg.com/latest.tar.gz && mkdir dist && tar zxf latest.tar.gz -C dist --strip-components 1
# ENV PATH "$PATH:/opt/yarn/dist/bin"

# Create the working dir
RUN mkdir -p /opt/app && mkdir /cache
WORKDIR /opt/app

# Do not use cache when we change node dependencies in package.json
ADD package.json yarn.lock /cache/

# Install packages + Prepare cache file
RUN cd /cache \
  && yarn config set cache-folder /usr/local/share/.cache/yarn \
  && yarn \
  && yarn global add forever testcafe \
  && cd /opt/app && ln -s /cache/node_modules node_modules \
  && tar czf /.yarn-cache.tgz /usr/local/share/.cache/yarn

COPY . /opt/app
COPY ./test/xvfb-run /usr/bin/xvfb-run

RUN NODE_PATH=src/ yarn run build

EXPOSE 3000
CMD ["forever", "./server.js"]
