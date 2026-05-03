data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project_id}-${var.env}-eau-001"
  location = var.location
}

# Storage account — blob container for images (public read)
resource "azurerm_storage_account" "sa" {
  name                            = "st${var.project_id}${var.env}eau001"
  resource_group_name             = azurerm_resource_group.rg.name
  location                        = azurerm_resource_group.rg.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  allow_nested_items_to_be_public = true
}

resource "azurerm_storage_container" "assets" {
  name                  = "assets"
  storage_account_id    = azurerm_storage_account.sa.id
  container_access_type = "blob"
}

# Container App Environment
resource "azurerm_container_app_environment" "cae" {
  name                       = "cae-${var.project_id}-${var.env}-eau-001"
  resource_group_name        = azurerm_resource_group.rg.name
  location                   = azurerm_resource_group.rg.location
}

# Container App — FastAPI backend (image pulled from GitHub Container Registry)
# NOTE: After first deploy, add the Tailscale sidecar via:
#   az containerapp update --name <name> --resource-group <rg> \
#     --container-name tailscale --image tailscale/tailscale:latest \
#     --set-env-vars TS_AUTHKEY=<key> TS_STATE_DIR=/var/lib/tailscale
resource "azurerm_container_app" "api" {
  name                         = "ca-${var.project_id}-${var.env}-eau-001"
  container_app_environment_id = azurerm_container_app_environment.cae.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  registry {
    server               = "ghcr.io"
    username             = var.ghcr_username
    password_secret_name = "ghcr-token"
  }

  secret {
    name  = "ghcr-token"
    value = var.ghcr_token
  }

  secret {
    name  = "database-url"
    value = var.database_url
  }

  secret {
    name  = "storage-connection"
    value = azurerm_storage_account.sa.primary_connection_string
  }

  template {
    min_replicas = 0
    max_replicas = 1

    container {
      name   = "api"
      image  = "ghcr.io/${var.ghcr_username}/reviewmap-api:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }

      env {
        name        = "AZURE_STORAGE_CONNECTION"
        secret_name = "storage-connection"
      }

      env {
        name  = "AZURE_STORAGE_CONTAINER"
        value = "assets"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8080
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

# Static Web App — React frontend (free tier)
resource "azurerm_static_web_app" "frontend" {
  name                = "stapp-${var.project_id}-${var.env}-eau-001"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_tier            = "Free"
  sku_size            = "Free"
}

output "static_web_app_url" {
  value = azurerm_static_web_app.frontend.default_host_name
}

output "container_app_url" {
  value = azurerm_container_app.api.latest_revision_fqdn
}
