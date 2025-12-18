# ---- Base image ----

FROM hmctspublic.azurecr.io/base/node:22-alpine as base
USER root
RUN corepack enable
USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}
RUN echo "WORKDIR=$WORKDIR"
ENV NODE_OPTIONS='--experimental-require-module'
RUN echo "==============================="
RUN echo "NODE_OPTIONS=$NODE_OPTIONS"
RUN echo "==============================="
RUN node -e "console.log('NODE_OPTIONS from node:', process.env.NODE_OPTIONS)"
RUN sleep 2

COPY --chown=hmcts:hmcts package.json yarn.lock ./

RUN yarn config set httpProxy "$http_proxy" \
    && yarn config set httpsProxy "$https_proxy" \
    && yarn workspaces focus --all --production \
    && rm -rf $(yarn cache clean) \

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
