
#AZURE VARIABLES
variable "subscription_id" {
  type = string
}

variable "client_id" {
  type = string
}

variable "client_secret" {
  type = string
}

variable "tenant_id" {
  type = string
}

#COMMON VARIABLES
variable "project_id" {
  type = string
}

variable "env" {
  type = string
}

variable "location" {
  type    = string
  default = "australiaeast"
}

#APP SERVICE PLAN VARIABLES
variable "asp_sku_name" {
  type = string
}

variable "asp_os_type" {
  type = string
}

#WEB APP VARIABLES
variable "app_name" {
  type = string
}

# SECRET VARIABLES
variable "github_auth_token" {
  type        = string
  description = "Github Auth Token from Github > Developer Settings > Personal Access Tokens > Tokens Classic (needs to have repo permission)"
}