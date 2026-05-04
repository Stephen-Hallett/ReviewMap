terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.70"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  client_id       = var.client_id
  client_secret   = var.client_secret
  tenant_id       = var.tenant_id
}

terraform {
  backend "azurerm" {
    resource_group_name  = "rg-reviewmap-dev-eau-001"
    storage_account_name = "stterraformdeveau001"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}
