FROM node:8.1.4-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app


COPY package.json /opt/app

# Update & Install theses apps.
RUN apk update && apk upgrade && apk add --no-cache rsync git python make gcc g++

RUN npm install

COPY . /opt/app
RUN npm run setup
COPY git.properties.json /opt/app

HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy= curl -k --silent --fail https://localhost:3000/health

EXPOSE 3000
CMD ["npm", "start" ]
