#!/usr/bin/bash
set -e

echo "START SERVICE WORKER [http://165.22.3.4:3005] \n"
node scripts/worker.js http://165.22.3.4:3005
