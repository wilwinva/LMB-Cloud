#!/bin/bash
changeVersion(){
  npm show @nwm/azure-npm-tester-example version
  if [[ $? != 0 ]] ; 
  then
    echo hello
    sed -i "s/\[VERSION\]/\"version\": \"1.0.0\",/g" package.json
  else
    local version="$(npm show @nwm/azure-npm-tester-example version)" 
    local patchVersion=$(echo $version | sed -E "s/([0-9]+\.)//gm")
    local newPatchVersion=$(( patchVersion + 1 ))
    local newVersion=$(echo $version | sed -E "s/([0-9]+\.?$)/$newPatchVersion/gm")
    sed -i "s/\[VERSION\]/\"version\": \"$newVersion\",/g" package.json
  fi
  return 0
}
