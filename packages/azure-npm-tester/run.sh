#/bin/bash
if [ "$1" == "sandia" ] ;
then
  bash build.sh "wwwproxy.sandia.gov" "80"
else
  bash build.sh
fi
echo "Running tester container named azure-npm-tester"
docker run -it --rm --name azure-npm-tester azure-npm-tester 
docker system prune --force
