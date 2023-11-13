output "front-door-host-name" {
  value       = module.app-web.host_name
  description = "The hostname of the azure front door"
}
