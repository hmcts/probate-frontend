# FROM node:8.6-alpine AS build

# RUN apk add --no-cache git

# # Update & Install theses apps.
# RUN apk update && apk upgrade && apk add --no-cache rsync git python make gcc g++

# # RUN go get github.com/hmcts/probate-frontend

# RUN mkdir -p /workspace

# COPY package.json /workspace

# RUN npm install

# COPY . /workspace
# RUN npm run setup
# COPY git.properties.json /workspace

# WORKDIR /workspace


# FROM node:8.1.4-alpine

# RUN mkdir -p /opt/app
# WORKDIR /opt/app

# COPY --from=build /workspace /opt/app

# COPY package.json /opt/app



# RUN npm install

# COPY . /opt/app
# RUN npm run setup
# COPY git.properties.json /opt/app

# HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy= curl -k --silent --fail https://localhost:3000/health

# EXPOSE 3000
# CMD ["npm", "start" ]


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