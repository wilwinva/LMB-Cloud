#!/bin/bash
addMeToCacerts () {
  certificate_expression="/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p"
  local host=$1
  local cert_file=$2
  if [ -z "$host" ] ;
  then
    echo "Error: host must be provided when adding to cacert"
    exit 1
  elif [ -z "$cert_file" ] ;
  then
    echo "Error: cert file must be provided when adding to cacert"
    exit 1
  elif [ -z "$proxy_host" ] || [ -z "$proxy_port" ] ;
  then
    echo -n | openssl s_client -servername $host -connect $host -connect $host:443 | sed -ne "$certificate_expression" > $cert_file
  else
    echo -n | openssl s_client -proxy $proxy_host:$proxy_port -servername $host -connect $host:443 | sed -ne "$certificate_expression" > $cert_file
  fi
  mkdir -p "/usr/local/share/ca-certificates/$host"
  chmod 755 "/usr/local/share/ca-certificates/$host"
  cp $cert_file "/usr/local/share/ca-certificates/$host"
  chmod 644 "/usr/local/share/ca-certificates/$host/$cert_file"
  update-ca-certificates
  return 0
}
