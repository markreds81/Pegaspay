#!/usr/bin/env bash

client_id="pegaspay-backend"
client_secret="BVAeOW17iInlA7QpxRsqvZpYL0RUPxxJ"
host="http://localhost:8080"
realm="pegaspay"

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
--data-urlencode client_secret=$client_secret \
--data-urlencode 'scope=openid' \
--data-urlencode username=$username \
--data-urlencode password=$password \
| jq -r '.access_token')

echo "Token: $TOKEN"
echo "$TOKEN" | pbcopy
echo "Token copied to clipboard."
