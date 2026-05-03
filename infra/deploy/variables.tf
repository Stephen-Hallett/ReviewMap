# Azure auth
variable "subscription_id" { type = string }
variable "client_id" { type = string }
variable "client_secret" {
  type      = string
  sensitive = true
}
variable "tenant_id" { type = string }

# Common
variable "project_id" { type = string }
variable "env" { type = string }
variable "location" {
  type    = string
  default = "australiaeast"
}

# # Database — Tailscale IP and credentials, populated after VM setup
# variable "database_url" {
#   type      = string
#   sensitive = true
# }

# GitHub Container Registry — username and PAT with read:packages scope
variable "ghcr_username" {
  type = string
}

variable "ghcr_token" {
  type      = string
  sensitive = true
}
