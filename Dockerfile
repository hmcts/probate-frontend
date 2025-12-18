# ---- Base image ----

FROM hmctspublic.azurecr.io/base/node:22-alpine as base
# Force CJS behavior globally
ENV NODE_OPTIONS="--no-experimental-detect-module"

USER root
RUN corepack enable
USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY --chown=hmcts:hmcts package.json yarn.lock ./

RUN yarn config set httpProxy "$http_proxy" \
    && yarn config set httpsProxy "$https_proxy" \
    && yarn workspaces focus --all --production \
    && rm -rf $(yarn cache clean)
# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./
USER root
RUN apk add --no-cache git
USER hmcts

COPY --chown=hmcts:hmcts . ./

# Remove old artifacts to prevent binary mismatch between Node 20 and 22
RUN rm -rf node_modules yarn.lock

# Re-run install to rebuild native modules (like sass/bindings) for Node 22
RUN PUPPETEER_SKIP_DOWNLOAD=true yarn install

RUN yarn setup-sass
RUN rm -rf /opt/app/.git

# ---- Runtime image ----
FROM build as runtime

# Ensure the flag persists to the final execution
ENV NODE_OPTIONS="--no-experimental-detect-module"

EXPOSE 3000
CMD ["yarn", "start" ]
