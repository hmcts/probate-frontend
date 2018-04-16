output "vaultUri" {
  value = "${module.probate-frontend-vault.key_vault_uri}"
}

output "vaultName" {
  value = "${module.probate-frontend-vault.key_vault_name}"
}
