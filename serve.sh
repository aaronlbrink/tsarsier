#!/bin/sh
set -e

# Start service
pm2-runtime -v node /usr/src/app/serve-server.js
