# ---- Base image ----

FROM hmctspublic.azurecr.io/base/node:18-alpine as base
USER root
RUN corepack enable
USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

# Copy over Yarn 3 configuration, release, and plugins
COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts .yarnrc.yml ./

COPY --chown=hmcts:hmcts package.json yarn.lock ./
# this gives error : Usage Error: Couldn't find a configuration settings named "proxy":  RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./

USER root
RUN apk add git
USER hmcts

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install \
    && yarn setup \
    && rm -rf /opt/app/.git

# ---- Runtime image ----
FROM base as runtime
COPY --from=build ${WORKDIR}/app app/
COPY --from=build ${WORKDIR}/config config/
COPY --from=build ${WORKDIR}/public public/
COPY --from=build ${WORKDIR}/server.js ${WORKDIR}/app.js ${WORKDIR}/git.properties.json ./
EXPOSE 3000
CMD ["yarn", "start" ]
