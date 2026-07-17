#!/bin/bash

# You can pass a specific tag as an argument (e.g., ./start_docker.sh 15-8f5b106)
# If no argument is passed, it defaults to 'latest'
TAG=${1:-latest}

echo "Starting containers with tag: $TAG"

echo "Cleaning up any existing containers..."
docker stop backend frontend 2>/dev/null
docker rm backend frontend 2>/dev/null

echo "Starting backend container..."
docker run -d \
  --name backend \
  --restart unless-stopped \
  --env-file .env_server \
  -p 5000:5000 \
  backend:$TAG

echo "Starting frontend container..."
docker run -d \
  --name frontend \
  --restart unless-stopped \
  -p 80:80 \
  frontend:$TAG

echo ""
echo "✅ Docker containers started successfully!"
docker ps
