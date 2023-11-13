FROM ubuntu:latest
ARG PROXY_HOST
ENV proxy_host=$PROXY_HOST
ARG PROXY_PORT
ENV proxy_port=$PROXY_PORT
WORKDIR /root
RUN mkdir src
COPY src/addMeToCacerts.sh src/addMeToCacerts.sh
COPY src/addSandiafiedStuff.sh src/addSandiafiedStuff.sh
RUN /bin/bash src/addSandiafiedStuff.sh
RUN apt-get update
RUN apt-get install -y curl ca-certificates apt-utils
RUN /bin/bash -c "source src/addMeToCacerts.sh && addMeToCacerts deb.nodesource.com deb-nodesource-com.crt"
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs
