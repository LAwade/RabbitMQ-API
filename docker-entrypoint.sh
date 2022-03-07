#!/usr/bin/env bash
set -e

echo "START SERVICE WORKER"

node scripts/worker.js http://165.22.3.4:3005
