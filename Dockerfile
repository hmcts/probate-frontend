# ---- Base image ----

FROM hmctspublic.azurecr.io/base/node:20-alpine as base
#USER root
#RUN corepack enable
#USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}


COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN which yarn
RUN ls -l $(which yarn)
RUN env
RUN yarn --version

RUN mkdir /opt/app_corepack
RUN corepack enable --install-directory /opt/app_corepack

RUN yarn config set http-proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"
RUN yarn install --production  \
    && yarn cache clean
# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./

USER root
RUN apk add git
USER hmcts

RUN PUPPETEER_SKIP_DOWNLOAD=true yarn install
RUN yarn -v
RUN node -v
RUN yarn setup-sass
RUN rm -rf /opt/app/.git

# ---- Runtime image ----
FROM build as runtime
#COPY --from=build . .
#COPY --from=build ${WORKDIR}/app app/
#COPY --from=build ${WORKDIR}/config config/
#COPY --from=build ${WORKDIR}/public public/
#COPY --from=build ${WORKDIR}/server.js ${WORKDIR}/app.js ${WORKDIR}/git.properties.json ./
EXPOSE 3000
CMD ["yarn", "start" ]
