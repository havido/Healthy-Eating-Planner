#!/bin/bash

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Configure the oracle instant client env variable
export DYLD_LIBRARY_PATH=/Volumes/Data/opt/instantclient-basiclite-macos.arm64-23.3.0.23.09-1/oracle:$DYLD_LIBRARY_PATH

# Start Node application
exec node server.js
