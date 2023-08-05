#!/bin/bash -x

# This script is designed to be copied to the target physical server where the singalling-server will be installed, and restart it.

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# kill previous server run
pkill -9 -f node

# npm install
cd signalling-server && npm install

cp ./.env.prod ./.env

#run the server
node "$SCRIPT_DIR/dist/server.js"