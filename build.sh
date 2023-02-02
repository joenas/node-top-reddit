#!/bin/bash
version=$(awk -F'"' '/"version": ".+"/{ print $4; exit; }' package.json)
docker build -t $REGISTRY_HOST/reddit:$version --platform linux/arm64 .
docker push $REGISTRY_HOST/reddit:$version
