provider "azurerm" {
  version = "1.22.1"
}

locals {
  aseName = "core-compute-${var.env}"
  previewVaultName = "${var.raw_product}-aat"
  nonPreviewVaultName = "${var.raw_product}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"
  localenv = "${(var.env == "preview" || var.env == "spreview") ? "aat": "${var.env}"}"
  probate_internal_base_url = "http://probate-frontend-${local.localenv}.service.core-compute-${local.localenv}.internal"
}

data "azurerm_subnet" "core_infra_redis_subnet" {
  name                 = "core-infra-subnet-1-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
  resource_group_name = "core-infra-${var.env}"
}

module "probate-frontend-redis-cache" {
  source   = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product  = "${var.product}-${var.component}-redis-cache"
  location = "${var.location}"
  env      = "${var.env}"
  subnetid = "${data.azurerm_subnet.core_infra_redis_subnet.id}"
  common_tags  = "${var.common_tags}"
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "${var.component}-redis-access-key"
  value        = "${module.probate-frontend-redis-cache.access_key}"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault" "probate_key_vault" {
  name = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}

data "azurerm_key_vault_secret" "probate_postcode_service_token" {
  name = "postcode-service-token2"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_postcode_service_url" {
  name = "postcode-service-url"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_survey" {
  name = "probate-survey"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_survey_end" {
  name = "probate-survey-end"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_application_fee_code" {
  name = "probate-application-fee-code"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_uk_application_fee_code" {
  name = "probate-uk-application-fee-code"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_overseas_application_fee_code" {
  name = "probate-overseas-application-fee-code"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_service_id" {
  name = "probate-service-id"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_site_id" {
  name = "probate-site-id"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_webchat_id" {
  name = "probate-webchat-id"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_webchat_tenant" {
  name = "probate-webchat-tenant"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_webchat_button_no_agents" {
  name = "probate-webchat-button-no-agents"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}
data "azurerm_key_vault_secret" "probate_webchat_button_busy" {
  name = "probate-webchat-button-busy"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "probate_webchat_button_service_closed" {
  name = "probate-webchat-button-service-closed"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "payCaseWorkerUser" {
  name = "payCaseWorkerUser"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "payCaseWorkerPass" {
  name = "payCaseWorkerPass"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "idam_secret_probate" {
  name = "ccidam-idam-api-secrets-probate"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}

data "azurerm_key_vault_secret" "s2s_key" {
  name      = "idam-s2s-secret"
  key_vault_id = "${data.azurerm_key_vault.probate_key_vault.id}"
}
module "probate-frontend" {
  source = "git@github.com:hmcts/cnp-module-webapp?ref=master"
  product = "${var.product}-${var.component}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"
  is_frontend = "${var.env != "preview" ? 1: 0}"
  subscription = "${var.subscription}"
  asp_name     = "${var.asp_name}"
  additional_host_name = "${var.external_host_name}"  // need to give proper url
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  capacity     = "${var.capacity}"
  common_tags  = "${var.common_tags}"
  asp_rg       = "${var.asp_rg}"

  app_settings = {
    WEBSITE_NODE_DEFAULT_VERSION = "12.15.0"

	  // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.product}-${var.component}"
    REFORM_ENVIRONMENT = "${var.env}"

	  // Packages
    PACKAGES_NAME="${var.packages_name}"
    PACKAGES_PROJECT="${var.packages_project}"
    PACKAGES_ENVIRONMENT="${var.packages_environment}"
    PACKAGES_VERSION="${var.packages_version}"

    DEPLOYMENT_ENV="${var.deployment_env}"

	  // Frontend web details
    PUBLIC_PROTOCOL ="${var.probate_frontend_protocol}"

    // Service name
    SERVICE_NAME = "${var.frontend_service_name}"

    VALIDATION_SERVICE_URL = "${var.probate_business_service_url}"
    SUBMIT_SERVICE_URL = "${var.probate_submit_service_url}"
    ORCHESTRATOR_SERVICE_URL = "${var.probate_orchestrator_service_url}"
    FEES_REGISTRY_URL = "${var.probate_fees_registry_service_url}"
    USE_HTTPS =  "${var.probate_frontend_https}"
    USE_AUTH = "${var.probate_frontend_use_auth}"
    GA_TRACKING_ID = "${var.probate_google_track_id}"
    WEBCHAT_CHAT_ID = "${data.azurerm_key_vault_secret.probate_webchat_id.value}"
    WEBCHAT_TENANT = "${data.azurerm_key_vault_secret.probate_webchat_tenant.value}"
    WEBCHAT_BUTTON_NO_AGENTS = "${data.azurerm_key_vault_secret.probate_webchat_button_no_agents.value}"
    WEBCHAT_BUTTON_AGENTS_BUSY = "${data.azurerm_key_vault_secret.probate_webchat_button_busy.value}"
    WEBCHAT_BUTTON_SERVICE_CLOSED = "${data.azurerm_key_vault_secret.probate_webchat_button_service_closed.value}"

    // REDIS
    USE_REDIS = "${var.probate_frontend_use_redis}"
    REDIS_USE_TLS = "${var.redis_use_tls}"
    REDIS_HOST      = "${module.probate-frontend-redis-cache.host_name}"
    REDIS_PORT      = "${module.probate-frontend-redis-cache.redis_port}"
    REDIS_PASSWORD  = "${module.probate-frontend-redis-cache.access_key}"

    // IDAM
    USE_IDAM = "${var.probate_frontend_use_idam}"
    IDAM_API_URL = "${var.idam_user_host}"
    IDAM_LOGIN_URL = "${var.probate_private_beta_auth_url}"
    IDAM_S2S_URL = "${var.idam_service_api}"
    IDAM_SERVICE_KEY = "${data.azurerm_key_vault_secret.s2s_key.value}"
    IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_PROBATE = "${data.azurerm_key_vault_secret.idam_secret_probate.value}"

    PAYMENT_API_URL = "${var.payment_create_url}"

    // POSTCODE
    POSTCODE_SERVICE_URL = "${data.azurerm_key_vault_secret.probate_postcode_service_url.value}"
    POSTCODE_SERVICE_TOKEN = "${data.azurerm_key_vault_secret.probate_postcode_service_token.value}"


    SURVEY = "${data.azurerm_key_vault_secret.probate_survey.value}"
    SURVEY_END_OF_APPLICATION = "${data.azurerm_key_vault_secret.probate_survey_end.value}"
    APPLICATION_FEE_CODE = "${data.azurerm_key_vault_secret.probate_application_fee_code.value}"
    UK_COPIES_FEE_CODE = "${data.azurerm_key_vault_secret.probate_uk_application_fee_code.value}"
    OVERSEAS_COPIES_FEE_CODE = "${data.azurerm_key_vault_secret.probate_overseas_application_fee_code.value}"
    SERVICE_ID = "${data.azurerm_key_vault_secret.probate_service_id.value}"
    SITE_ID = "${data.azurerm_key_vault_secret.probate_site_id.value}"

    REFORM_ENVIRONMENT = "${var.reform_envirionment_for_test}"
    REQUIRE_CCD_CASE_ID = "${var.require_ccd_case_id}"
    FEATURE_TOGGLES_API_URL = "${var.feature_toggles_api_url}"
    // Cache
    WEBSITE_LOCAL_CACHE_OPTION = "${var.website_local_cache_option}"
    WEBSITE_LOCAL_CACHE_SIZEINMB = "${var.website_local_cache_sizeinmb}"
    IDAM_CLIENT_NAME = "probate"

    PROBATE_USER_EMAIL = "${data.azurerm_key_vault_secret.payCaseWorkerUser.value}"
    PROBATE_USER_PASSWORD = "${data.azurerm_key_vault_secret.payCaseWorkerPass.value}"
  }
}
