#!/bin/bash
setupNpmrc (){
  local access_token=$1
  local email=$2
  local is_nwm=$3
  if [ "0" == $is_nwm ] ;
  then
    if [ -n "$proxy_host" ] && [ -n "$proxy_port" ] ;
    then
      echo "proxy=http://$proxy_host:$proxy_port" >> .npmrc
      echo "https-proxy=http://$proxy_host:$proxy_port" >> .npmrc
    fi
  elif [ -z "$access_token" ] ;
  then
    echo "Error: An access token must be provided."
    exit 1
  elif [ -z "$email" ] ;
  then
    echo "Error: An email must be provided."
    exit 1
  else
    local base_64_access_token=$(node -e "console.log(Buffer.from(\"$access_token\", 'utf-8').toString('base64'));")
    sed -i "s/\[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN\]/\"$base_64_access_token\"/g" .npmrc 
    sed -i "s/\[EMAIL\]/$email/g" .npmrc
    echo "strict-ssl=false" >> .npmrc 
    echo "cafile=/etc/ssl/certs/ca-certificates.crt" >> .npmrc
    if [ -n "$proxy_host" ] && [ -n "$proxy_port" ] ;
    then
      echo "proxy=http://$proxy_host:$proxy_port" >> .npmrc
      echo "https-proxy=http://$proxy_host:$proxy_port" >> .npmrc
    fi
  fi
}

