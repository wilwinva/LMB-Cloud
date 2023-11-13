variable "keyvault-ad-auth" {
  description = "active directory connection secret used for auth on the app service"
  type        = string
}

variable "client_id" {
  description = "client id for the service principle"
  type        = string
}

variable "front-door-backend-ip" {
  description = "ip addresses that front door uses"
  type        = string
  default     = "168.63.129.16"
}

variable "name" {
  description = "The name of this resource, will be prefixed to each resource"
  type        = string
  default     = "nwm-tdms"
}

variable "env" {
  description = "The instance (development, staging, production)"
  type        = string
  default     = "development"
}

variable "location" {
  type    = string
  default = "westus2"
}

variable "tier" {
  type    = string
  default = "Shared"
}

variable "size" {
  type    = string
  default = "D1"
}

variable "number-of-app-slots" {
  type    = number
  default = 0
}

variable "service-plan-resource-group" {
  type = string
}
