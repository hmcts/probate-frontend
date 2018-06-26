#!/bin/bash
set -ex

export TEST_E2E_URL=$(echo ${TEST_URL} | sed -e  "s/-staging//")

yarn test-e2e

#below 2 lines for function test output in cnp pipeline
mkdir functional-output
cp -r output/mochawesome.* functional-output/.
