#!/bin/bash

cd /opt/projects/develop/vt-producer-front/

git status
git pull origin develop

npm install
npm run build:prod
nohup npm run server:prod &