provider "vault" {
  //  # It is strongly recommended to configure this provider through the
  //  # environment variables described above, so that each user can have
  //  # separate credentials set in the environment.
  //  #
  //  # This will default to using $VAULT_ADDR
  //  # But can be set explicitly
  address = "https://vault.reform.hmcts.net:6200"
}

data "vault_generic_secret" "probate_postcode_service_token" {
  path = "secret/${var.vault_section}/probate/postcode_service_token"
}

data "vault_generic_secret" "probate_postcode_service_url" {
  path = "secret/${var.vault_section}/probate/postcode_service_url"
}

data "vault_generic_secret" "probate_survey" {
  path = "secret/${var.vault_section}/probate/probate_survey"
}

data "vault_generic_secret" "probate_survey_end" {
  path = "secret/${var.vault_section}/probate/probate_survey_end"
}

data "vault_generic_secret" "probate_application_fee_code" {
  path = "secret/${var.vault_section}/probate/probate_application_fee_code"
}

data "vault_generic_secret" "probate_uk_application_fee_code" {
  path = "secret/${var.vault_section}/probate/probate_uk_application_fee_code"
}

data "vault_generic_secret" "probate_overseas_application_fee_code" {
  path = "secret/${var.vault_section}/probate/probate_overseas_application_fee_code"
}

data "vault_generic_secret" "probate_service_id" {
  path = "secret/${var.vault_section}/probate/probate_service_id"
}

data "vault_generic_secret" "probate_site_id" {
  path = "secret/${var.vault_section}/probate/probate_site_id"
}

data "vault_generic_secret" "idam_frontend_service_key" {
  path = "secret/${var.vault_section}/ccidam/service-auth-provider/api/microservice-keys/probate-frontend"
}

data "vault_generic_secret" "idam_frontend_idam_key" {
  path = "secret/${var.vault_section}/ccidam/idam-api/oauth2/client-secrets/probate"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"

  previewVaultName = "${var.product}-fe"  // max 24 char else used fronend
  nonPreviewVaultName = "${var.product}-fe-${var.env}"
  vaultName = "${var.env == "preview" ? local.previewVaultName : local.nonPreviewVaultName}"

  nonPreviewVaultUri = "${module.probate-frontend-vault.key_vault_uri}"
  previewVaultUri = "https://probate-frontend-aat.vault.azure.net/"
  vaultUri = "${var.env == "preview"? local.previewVaultUri : local.nonPreviewVaultUri}"
  
  //once Backend is up in CNP need to get the 
  //localBusinessServiceUrl = "http://probate-business-service-${var.env}.service.${local.aseName}.internal"
  //businessServiceUrl = "${var.env == "preview" ? "http://probate-business-service-aat.service.core-compute-aat.internal" : local.localClaimStoreUrl}"
  // add other services
}

module "redis-cache" {
  source   = "git@github.com:contino/moj-module-redis?ref=master"
  product  = "${var.product}"
  location = "${var.location}"
  env      = "${var.env}"
  subnetid = "${data.terraform_remote_state.core_apps_infrastructure.subnet_ids[2]}"
}

module "probate-frontend" {
  source = "git@github.com:hmcts/moj-module-webapp.git?ref=master"
  product = "${var.product}-${var.microservice}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"
  is_frontend  = true
  subscription = "${var.subscription}"
  additional_host_name = "${var.external_host_name}"  // need to give proper url

  app_settings = {
    
    // Node specific vars
    //NODE_ENV = "${var.node_env}"
    //UV_THREADPOOL_SIZE = "64"
    //NODE_CONFIG_DIR = "${var.node_config_dir}"
    
	  // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.product}-${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"
  
	  // Packages
    PACKAGES_NAME="${var.packages_name}"
    PACKAGES_PROJECT="${var.packages_project}"
    PACKAGES_ENVIRONMENT="${var.packages_environment}"
    PACKAGES_VERSION="${var.packages_version}"
	
    DEPLOYMENT_ENV="${var.deployment_env}"

	  // Frontend web details
    FRONTEND_HOSTNAME ="${var.probate_frontend_hostname}"
    PUBLIC_PROTOCOL ="${var.probate_frontend_protocol}"
    //PUBLIC_PORT = "${var.probate_frontend_public_port}"
  	//PORT = "${var.probate_frontend_port}"
  	//PROBATE_HTTP_PROXY = "${var.outbound_proxy}"
  	//no_proxy = "${var.no_proxy}"

    // Service name
    SERVICE_NAME = "${var.frontend_service_name}"

    VALIDATION_SERVICE_URL = "${var.probate_business_service_url}"
    SUBMIT_SERVICE_URL = "${var.probate_submit_service_url}"
    PERSISTENCE_SERVICE_URL = "${var.probate_persistence_service_url}"
    USE_HTTPS =  "${var.probate_frontend_https}"
    USE_AUTH = "${var.probate_frontend_use_auth}"
    GA_TRACKING_ID = "${var.probate_google_track_id}"

    // REDIS
    USE_REDIS = "${var.probate_frontend_use_redis}"
    //REDIS_HOST = "${var.probate_redis_url}"
    //REDIS_PORT = "${var.f5_redis_listen_port}"
    REDIS_HOST      = "${module.probate-frontend-redis-cache.host_name}"
    REDIS_PORT      = "${module.probate-frontend-redis-cache.redis_port}"
    REDIS_PASSWORD  = "${module.probate-frontend-redis-cache.access_key}"

    // IDAM
    USE_IDAM = "${var.probate_frontend_use_idam}"
    IDAM_API_URL = "${var.idam_user_host}"
    IDAM_LOGIN_URL = "${var.probate_private_beta_auth_url}"
    IDAM_S2S_URL = "${var.idam_service_api}"
    IDAM_SERVICE_KEY = "${data.vault_generic_secret.idam_frontend_service_key.data["value"]}"
    IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_PROBATE = "${data.vault_generic_secret.idam_frontend_idam_key.data["value"]}"

    //  PAYMENT
    PAYMENT_CREATE_URL = "${var.payment_create_url }"
    PAYMENT_RETURN_URL = "${var.payment_return_url }"

    // POSTCODE
    POSTCODE_SERVICE_URL = "${data.vault_generic_secret.probate_postcode_service_url.data["value"]}"
    POSTCODE_SERVICE_TOKEN = "${data.vault_generic_secret.probate_postcode_service_token.data["value"]}"

    SURVEY = "${data.vault_generic_secret.probate_survey.data["value"]}"
    SURVEY_END_OF_APPLICATION = "${data.vault_generic_secret.probate_survey_end.data["value"]}"
    APPLICATION_FEE_CODE = "${data.vault_generic_secret.probate_application_fee_code.data["value"]}"
    UK_COPIES_FEE_CODE = "${data.vault_generic_secret.probate_uk_application_fee_code.data["value"]}"
    OVERSEAS_COPIES_FEE_CODE = "${data.vault_generic_secret.probate_overseas_application_fee_code.data["value"]}"
    SERVICE_ID = "${data.vault_generic_secret.probate_service_id.data["value"]}"
    SITE_ID = "${data.vault_generic_secret.probate_site_id.data["value"]}"

    // Functional tests
    //TEST_E2E_FRONTEND_URL = "${var.probate_frontend_hostname}"
    //E2E_FRONTEND_URL = "${var.probate_frontend_hostname}"
  }
}



module "probate-frontend-vault" {
  source              = "git@github.com:hmcts/moj-module-key-vault?ref=master"
  name                = "${local.vaultName}"
  product             = "${var.product}"
  env                 = "${var.env}"
  tenant_id           = "${var.tenant_id}"
  object_id           = "${var.jenkins_AAD_objectId}"
  resource_group_name = "${module.probate-frontend.resource_group_name}"
  product_group_object_id =  "68839600-92da-4862-bb24-1259814d1384"
}