#!/bin/bash
set -ex

yarn test:crossbrowser_IE11
sleep 2s
yarn test:crossbrowser_Edge
sleep 2s
yarn test:crossbrowser_chrome
sleep 2s
yarn test:crossbrowser_firefox


