data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project_id}-${var.env}-eau-001"
  location = "australiaeast"
}

resource "azurerm_storage_account" "sa" {
  name                     = "sa${var.project_id}${var.env}eau001"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "assets-container" {
  name                 = "assets"
  storage_account_name = azurerm_storage_account.sa.name
}

resource "azurerm_storage_table" "locations" {
  name                 = "locations"
  storage_account_name = azurerm_storage_account.sa.name
}

resource "azurerm_storage_table" "categories" {
  name                 = "categories"
  storage_account_name = azurerm_storage_account.sa.name
}

resource "azurerm_service_plan" "asp" {
  name                = "asp-${var.project_id}-${var.env}-eau-001"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = var.asp_os_type
  sku_name            = var.asp_sku_name
}

# Create the web app, pass in the App Service Plan ID
resource "azurerm_linux_web_app" "webapp" {
  name                = var.app_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.asp.id
  https_only          = true
  site_config {
    minimum_tls_version = "1.2"
    always_on           = false #Deploying free tier webapp without this will fail
    application_stack {
      node_version = "16-lts"
    }
  }
}

#  Deploy code from a public GitHub repo
resource "azurerm_app_service_source_control" "sourcecontrol" {
  app_id                 = azurerm_linux_web_app.webapp.id
  repo_url               = "https://github.com/Stephen-Hallett/ReviewMap"
  branch                 = "main"
  use_manual_integration = false
  use_mercurial          = false
  github_action_configuration {
    code_configuration {
      runtime_stack   = "node"
      runtime_version = "v16.20.2"
    }
  }
}

resource "azurerm_source_control_token" "source_control_token" {
  type         = "GitHub"
  token        = var.github_auth_token
  token_secret = var.github_auth_token
}
