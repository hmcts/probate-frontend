env = "aat"
deployment_env = "preprod"

vault_section = "preprod"

packages_environment = "preprod"
packages_version = "3.0.0"

external_host_name = "probate.aat.platform.hmcts.net"

probate_google_track_id = "UA-93598808-1"

probate_frontend_https = "false"
probate_frontend_use_auth = "false"

payment_create_url = "https://preprod.payments.reform.hmcts.net:4401/users/userId/payments"

idam_service_api = "http://rpe-service-auth-provider-aat.service.core-compute-aat.internal"

#probate_private_beta_auth_url = "https://idam.preprod.ccidam.reform.hmcts.net/login"
probate_private_beta_auth_url = "https://idam-web-public-idam-aat.service.core-compute-idam-aat.internal/login"
#idam_user_host = "https://preprod-idamapi.reform.hmcts.net:3511"
idam_user_host = "https://idam-api.aat.platform.hmcts.net/"

probate_deployment_env = "test"


probate_frontend_port = "3101"

probate_frontend_use_idam = "true"

probate_frontend_use_redis = "true"

reform_envirionment_for_test = "aat"
 
probate_business_service_url = "http://probate-business-service-aat.service.core-compute-aat.internal/validate"

probate_submit_service_url = "http://probate-submit-service-aat.service.core-compute-aat.internal/submit"

probate_persistence_service_url = "http://probate-persistence-service-aat.service.core-compute-aat.internal/formdata"

capacity = "2"
