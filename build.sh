#!/bin/bash

mkdir -p build

echo "Compilando el servidor..."
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o build/server ./server

