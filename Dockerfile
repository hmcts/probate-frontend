FROM node:8.9.4-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package.json /opt/app

# Update & Install theses apps.
RUN apk add --no-cache git

RUN yarn install --production

COPY . /opt/app
RUN yarn setup

RUN rm -rf .git

HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy= curl -k --silent --fail https://localhost:3000/health

EXPOSE 3000
CMD ["yarn", "start" ]
