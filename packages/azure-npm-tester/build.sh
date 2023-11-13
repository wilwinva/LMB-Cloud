#!/bin/bash
echo "Please input your user specific access token from Azure: "
read -s access_token
echo "Please input your email address: "
read email
if [ -z "$1" ] || [ -z "$2" ] ;
then
  echo "Building outisde Sandia"
  docker build . -t azure-npm-tester-base --file Base.dockerfile
  docker build . -t azure-npm-tester --file Tester.dockerfile --no-cache --build-arg ACCESS_TOKEN=$access_token --build-arg EMAIL=$email
else
  echo "Building inside Sandia"
  docker build . -t azure-npm-tester-base --build-arg PROXY_HOST=$1 --build-arg PROXY_PORT=$2 --file Base.dockerfile
  docker build . -t azure-npm-tester --file Tester.dockerfile --no-cache --build-arg ACCESS_TOKEN=$access_token --build-arg EMAIL=$email
fi
