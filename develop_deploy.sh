#!/bin/bash

cd /opt/projects/develop/vt-producer-front/

git status
git pull origin develop

npm install
npm run build:prod
pm2 restart GrainBroker
