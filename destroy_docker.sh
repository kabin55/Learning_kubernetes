#!/bin/bash

echo "Stopping and removing CloudOps Lab containers..."

docker stop backend frontend 2>/dev/null
docker rm backend frontend 2>/dev/null

echo "✅ Docker containers destroyed."
