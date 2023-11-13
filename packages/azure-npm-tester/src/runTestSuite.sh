#!/bin/bash
source src/addMeToCacerts.sh
source src/setupNpmrc.sh
source src/changeVersion.sh
addMeToCacerts pkgs.dev.azure.com pkgs-dev-azure-com.crt
givenThatANwmDeveloperWantsToPublishAnArtifactWhenTheDeveloperTriesToAndAnAppropriatePersonalAccessTokenThenThatShouldBeSuccessful () {
  echo "Running test givenThatANwmDeveloperWantsToPublishAnArtifactWhenTheDeveloperTriesToAndAnAppropriatePersonalAccessTokenThenThatShouldBeSuccessful"
  setupNpmrc $access_token $email "1"
  changeVersion
  if [ $? != 0 ] ;
  then
    echo "givenThatANwmDeveloperWantsToPublishAnArtifactWhenTheDeveloperTriesToAndAnAppropriatePersonalAccessTokenThenThatShouldBeSuccessful failed"
    exit 1
  fi
  npm update
  npm i 
  npm publish 
  if [ $? != 0 ] ;
  then
    echo "givenThatANwmDeveloperWantsToPublishAnArtifactWhenTheDeveloperTriesToAndAnAppropriatePersonalAccessTokenThenThatShouldBeSuccessful failed"
    exit 1
  fi
  return 0
}

givenThatANonNwmDeveloperWantsToConsumeAnArtifactWhenTheDeveloperTriedToConsumeItThenShouldFail () {
  echo "Running test givenThatANonNwmDeveloperWantsToConsumeAnArtifactWhenTheDeveloperTriedToConsumeItThenShouldFail"
  rm .npmrc
  cd non-nwm
  setupNpmrc $access_token $email "0"
  cat .npmrc
  sed -i "s/\[VERSION\]/\"version\": \"1.0.0\",/g" package.json
  rm "$(npm root -g)/@nwm" -rf
  npm update
  npm i
  npm show @nwm/azure-npm-tester-example version
  if [[ $? != 0 ]] ; 
  then
    echo "All tests ran successfully!" 
    return 0
  fi
  echo "givenThatANonNwmDeveloperWantsToConsumeAnArtifactWhenTheDeveloperTriedToConsumeItThenShouldFail failed"
  exit 1
}

givenThatANwmDeveloperWantsToPublishAnArtifactWhenTheDeveloperTriesToAndAnAppropriatePersonalAccessTokenThenThatShouldBeSuccessful 
givenThatANonNwmDeveloperWantsToConsumeAnArtifactWhenTheDeveloperTriedToConsumeItThenShouldFail 
