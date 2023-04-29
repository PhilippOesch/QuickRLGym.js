#!/bin/bash
set -e

echo "start deployment"
docker buildx build -t 192.168.0.135:5000/quickrljs:latest . --platform linux/amd64
docker push 192.168.0.135:5000/quickrljs:latest  
echo "deployment finished successful"