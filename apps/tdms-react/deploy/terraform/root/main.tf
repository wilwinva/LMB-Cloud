# Set  azurerm as provider
provider "azurerm" {
  version = "=2.23.0"
  features {}
}

terraform {
  backend "azurerm" {}
}

module "app-web" {
  source = "../../../../../deploy/terraform/terraform-modules/app-web"

  env                         = var.env
  name                        = var.name
  keyvault-ad-auth            = var.keyvault-ad-auth
  size                        = var.size
  tier                        = var.tier
  client_id                   = var.client_id
  number-of-app-slots         = var.number-of-app-slots
  service-plan-resource-group = "app-service-rg"
}
