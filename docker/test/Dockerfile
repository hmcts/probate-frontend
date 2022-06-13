FROM node:18.3.0

# Update & Install theses apps.
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y xvfb libgtk2.0-0 libgconf-2-4 libasound2 libxtst6 libxss1 libnss3

RUN mkdir -p /opt/app/test
WORKDIR /opt/app

COPY package.json /opt/app

RUN npm install

COPY . /opt/app
RUN npm run setup

CMD NODE_PATH=. xvfb-run -a node ./node_modules/codeceptjs/bin/codecept.js run  -c ./test/end-to-end/ --steps --reporter mochawesome
