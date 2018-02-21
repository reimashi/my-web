#!/bin/bash

Version="0.1"

ClientDir="$(pwd)/client"
ServerDir="$(pwd)/server"

BuildDir="$(pwd)/dist"
ClientBuildDir="$BuildDir/static"

function compile_server {
    if ! type go > /dev/null 2>&1; then
        echo "Instalando dependencia: golang"
        sudo add-apt-repository ppa:gophers/archive > /dev/null
        sudo apt-get update > /dev/null
        sudo apt-get install golang-1.9-go
    fi

    echo "Compilando el servidor..."
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o ${BuildDir}/server ${ServerDir}
}

function compile_client {
    if ! type node > /dev/null 2>&1; then
        echo "Instalando dependencia: Node.js"
        curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi

    if ! type yarn > /dev/null 2>&1; then
        echo "Instalando dependencia: yarn"
        sudo npm install -g yarn
    fi

    if ! type webpack > /dev/null 2>&1; then
        echo "Instalando dependencia: webpack"
        sudo npm install -g webpack
    fi

    mkdir -p ${ClientDir}
    cd ${ClientDir}

    echo "Compilando el código javascript del cliente..."
    webpack --env.BuildDir=${BuildDir} --config webpack.config.build.js

    cd ..
}

# Install dependencies
if ! type apt-get > /dev/null 2>&1; then
    echo "Este script solo es compatible con sistemas ubuntu (Aunque deberia funcionar en otros sistemas debian-like)"
fi

# Make build directory
mkdir -p ${BuildDir}
if [ ! -f ${BuildDir}/server ]; then
    compile_server
fi

# Execute in dev mode
echo "Ejecutando servidor..."
export STATIC_PATH=${ClientBuildDir}
exec ${BuildDir}/server