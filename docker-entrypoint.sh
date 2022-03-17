#!/bin/sh

npm start
node scripts/worker.js 144.22.138.135:3003

exec "$@"
