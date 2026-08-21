get_secret() {
    local name="$1"
    az keyvault secret show --vault-name probate-aat --name ${name} --query value -o tsv
}

TEST_URL='https://probate-frontend-pr-3388.preview.platform.hmcts.net' \
RETRY_FEATURES=0 \
RETRY_SCENARIOS=0 \
RETRY_STEPS=0 \
TEST_HEADLESS='false' \
DONT_TEST_WELSH='true' \
DONT_FAIL_ON_EMPTY_RUN=1 \
NODE_ENV=test-dk \
NODE_PATH=. \
IDAM_API_URL="$(get_secret testIdamBaseUrl)" \
IDAM_LOGIN_URL="$(get_secret testIdamLoginUrl)" \
USE_IDAM="$(get_secret testUseIdam)" \
INVITE_ID_LIST_URL="$(get_secret testInviteIdListUrl)" \
PIN_URL="$(get_secret testPinUrl)" \
INVITATION_URL="$(get_secret testInvitationUrl)" \
IDAM_ADD_USER_URL="$(get_secret testIdamAddUserUrl)" \
IDAM_CITIZEN_ROLE="$(get_secret testIdamRole)" \
IDAM_USER_GROUP="$(get_secret testIdamUserGroup)" \
CITIZEN_EMAIL_DOMAIN="$(get_secret testCitizenDomain)" \
TEST_EMAIL_ADDRESS="$(get_secret testEnvEmailAddress)" \
TEST_MOBILE_NUMBER="$(get_secret testEnvMobileNumber)" \
TERMS_AND_CONDITIONS="$(get_secret testTerms)" \
SURVEY="$(get_secret testSurvey)" \
SURVEY_END_OF_APPLICATION="$(get_secret testsurveyEndOfApplication)" \
POSTCODE_SERVICE_URL="$(get_secret testPostcodeServiceUrl)" \
ADDRESS_TOKEN="$(get_secret testPostCodeAddressToken2)" \
RUN_E2E_TEST="$(get_secret testRunE2ETest)" \
VALIDATION_SERVICE_URL="$(get_secret testValidationServiceUrl)" \
LAUNCHDARKLY_KEY="$(get_secret launchdarkly-key)" \
LAUNCHDARKLY_USER_KEY="$(get_secret launchdarklyUserkeyFrontend)" \
APPINSIGHTS_INSTRUMENTATIONKEY="$(get_secret AppInsightsInstrumentationKey)" \
yarn node ./node_modules/codeceptjs/bin/codecept.js run -c ./test/end-to-end/codecept.e2e.conf.js --steps --grep '@e2enightly-a'

