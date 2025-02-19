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

RUN mkdir /home/hmcts/app_corepack
RUN corepack enable --install-directory /home/hmcts/corepack_install

RUN /home/hmcts/corepack_install/yarn config set http-proxy "$http_proxy" && /home/hmcts/corepack_install/yarn config set https-proxy "$https_proxy"
RUN /home/hmcts/corepack_install/yarn install --production  \
    && /home/hmcts/corepack_install/yarn cache clean
# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./

USER root
RUN apk add git
USER hmcts

RUN PUPPETEER_SKIP_DOWNLOAD=true /home/hmcts/corepack_install/yarn install
RUN /home/hmcts/corepack_install/yarn -v
RUN node -v
RUN /home/hmcts/corepack_install/yarn setup-sass
RUN rm -rf /opt/app/.git

# ---- Runtime image ----
FROM build as runtime
#COPY --from=build . .
#COPY --from=build ${WORKDIR}/app app/
#COPY --from=build ${WORKDIR}/config config/
#COPY --from=build ${WORKDIR}/public public/
#COPY --from=build ${WORKDIR}/server.js ${WORKDIR}/app.js ${WORKDIR}/git.properties.json ./
EXPOSE 3000
CMD ["/home/hmcts/corepack_install/yarn", "start" ]
