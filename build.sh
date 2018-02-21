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

function compile_docker {
    if ! type docker > /dev/null 2>&1; then
        echo "Instalando dependencia: docker"
        sudo apt-get install apt-transport-https ca-certificates curl software-properties-common -y 2> /dev/null
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
        sudo apt-get update > /dev/null
        sudo apt-get install docker-ce -y
    fi

    ImageName="reimashi/my-web"

    echo "Compilando la imagen de docker..."
    docker build . -t ${ImageName}:${Version} -t ${ImageName}:latest

    echo "Enviando imagen a DockerHub..."
    FirstPushResult=`docker push ${ImageName}:${Version}`
    if [ ! ${FirstPushResult} ]; then
        docker login
        docker push ${ImageName}:${Version}
    fi
    docker push ${ImageName}:latest
}

# Install dependencies
if ! type apt-get > /dev/null 2>&1; then
    echo "Este script solo es compatible con sistemas ubuntu (Aunque deberia funcionar en otros sistemas debian-like)"
fi

if ! type dialog > /dev/null 2>&1; then
    echo "Instalando dependencia: dialog"
    sudo apt-get install dialog -y
fi

# Make build directory
if [ ! -d ${BuildDir} ]; then
    sudo rm -Rf ${BuildDir}
fi
mkdir -p ${BuildDir}

WhatDo=`/usr/bin/dialog --stdout --checklist 'Elije los paquetes a compilar:' 80 40 20 1 'Servidor' off 2 'Cliente web' on 3 'Repositorio docker' off`

if [ $? -eq 0 ]
then
    for Task in ${WhatDo}
    do
        case ${Task} in
        1)
            compile_server
            ;;
        2)
            compile_client
            ;;
        3)
            compile_docker
            ;;
        esac
    done
else
    echo "Si no tienes nada que hacer no me molestes"
fi