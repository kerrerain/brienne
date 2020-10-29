FROM node:12

RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/*

# https://github.com/puppeteer/puppeteer/issues/3451#issuecomment-523961368
RUN echo 'kernel.unprivileged_userns_clone=1' > /etc/sysctl.d/userns.conf

RUN groupadd -r brienne && \
    useradd --no-log-init -r -g brienne brienne

WORKDIR /usr/src/app

COPY . .

RUN yarn set version berry && \
    yarn install

RUN chmod -R 775 /usr/src/app && \
    chown -R brienne:brienne /usr/src/app

USER brienne

ENTRYPOINT ["./run.sh"]
