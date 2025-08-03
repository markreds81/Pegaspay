#!/usr/bin/env bash

client_id="pegaspay-frontend"
host="http://localhost:8080"
realm="pegaspay"

pad_base64() {
  local len=$((${#1} % 4))
  if [ $len -eq 2 ]; then
    echo "$1=="
  elif [ $len -eq 3 ]; then
    echo "$1="
  else
    echo "$1"
  fi
}

if [ $# -eq 2 ]
then
	username=$1
	password=$2
else
	echo "No credentials provided. Usage: $0 <username> <password>"
	exit 1
fi

TOKEN=$(curl -L -X POST $host/realms/$realm/protocol/openid-connect/token \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode client_id=$client_id \
--data-urlencode grant_type=password \
--data-urlencode username=$username \
--data-urlencode password=$password \
| jq -r '.access_token')
PAYLOAD=$(echo "$TOKEN" | cut -d "." -f2)
PADDED_PAYLOAD=$(pad_base64 "$PAYLOAD")

echo "Access Token:"
echo "$TOKEN"
echo
echo "Claims:"
echo "$PADDED_PAYLOAD" | base64 --decode | jq .
echo
echo "$TOKEN" | pbcopy
echo "Token copied to clipboard."
