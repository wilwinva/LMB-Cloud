FROM azure-npm-tester-base:latest 
ARG ACCESS_TOKEN
ARG EMAIL
ENV access_token=$ACCESS_TOKEN
ENV email=$EMAIL
COPY .npmrc .npmrc
COPY package package.json
COPY src/setupNpmrc.sh src/setupNpmrc.sh
COPY src/changeVersion.sh src/changeVersion.sh
COPY src/runTestSuite.sh src/runTestSuite.sh
COPY src/index.js src/index.js
RUN mkdir non-nwm -f
COPY non-nwm/.npmrc non-nwm/.npmrc
COPY non-nwm/mock_package.json non-nwm/package.json
COPY src/setupNpmrc.sh src/non-nwm/setupNpmrc.sh
RUN chmod +x src/runTestSuite.sh
CMD [ "/bin/bash", "-c", "src/runTestSuite.sh" ]
