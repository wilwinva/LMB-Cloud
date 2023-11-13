#/bin/bash
if [ -z "$PROXY_HOST" ] || [ -z "$PROXY_PORT" ] ;
then
  echo "I am outside Sandia... yay!";
else
  http_proxy="http://$PROXY_HOST:$PROXY_PORT";
  echo "I am inside Sandia... grrr!";
  echo "Acquire::http::proxy \"$http_proxy\";" > /etc/apt/apt.conf;
  echo "Acquire::https::proxy \"$http_proxy\";" >> /etc/apt/apt.conf;
  echo "proxy=$PROXY_HOST:$PROXY_PORT" > /root/.curlrc;
fi


