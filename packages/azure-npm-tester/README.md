#What am I?

- I contain integration tests that run against Azure for NPM related cases.

#Dependency

- You must have docker installed in order to run these tests. Eventually these tests should be automated in the Azure cloud environment.

#How to run?

- Either follow the logic with the shell scripts located in the root of this package or execute run-sandia.sh or run-outisde.sh. Make sure to run this shell as sudo or have user level access to your docker commands.
- run-sandia.sh should be run when your execution environment is within the Sandia's networks
- run-outside.sh should be run when you are outside Sandia's networks.
- Basically the code is split in order to ensure proxy access
