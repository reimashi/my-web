#!/bin/bash

CLIENTDIR="./client"
SERVERDIR="./server"

BUILDDIR="./build"
CLIENTBD="$BUILDDIR/static"

function compile_server {
    if ! type go > /dev/null 2>&1; then
        echo "Instalando dependencia: golang"
        sudo add-apt-repository ppa:gophers/archive > /dev/null
        sudo apt-get update > /dev/null
        sudo apt-get install golang-1.9-go > /dev/null
    fi

    echo "Compilando el servidor..."
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o $BUILDDIR/server $SERVERDIR
}

function compile_client {
    if ! type node > /dev/null 2>&1; then
        echo "Instalando dependencia: Node.js"
        curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
        sudo apt-get install -y nodejs > /dev/null
    fi

    if ! type yarn > /dev/null 2>&1; then
        echo "Instalando dependencia: yarn"
        sudo npm install -g yarn
    fi

    if ! type webpack > /dev/null 2>&1; then
        echo "Instalando dependencia: webpack"
        sudo npm install -g webpack
    fi

    mkdir -p $CLIENTBD
    cd $CLIENTDIR

    echo "Compilando el código javascript del cliente..."
    webpack --config webpack.config.build.js

    cd ..
}

# Install dependencies
if ! type apt-get > /dev/null 2>&1; then
    echo "Este script solo es compatible con sistemas ubuntu (Aunque deberia funcionar en otros sistemas debian-like)"
fi

if ! type dialog > /dev/null 2>&1; then
    echo "Instalando dependencia: dialog"
    sudo apt-get install dialog -y > /dev/null
fi

# Make build directory
if [ ! -d $BUILDDIR ]; then
    sudo rm -Rf $BUILDDIR
fi
mkdir -p $BUILDDIR

WHATDO=`/usr/bin/dialog --stdout --checklist 'Elije los paquetes a compilar:' 80 40 20 1 Servidor on 2 'Cliente web' on 3 'Repositorio docker' on`

if [ $? -eq 0 ]
then
    for TASK in $WHATDO
    do
        case $TASK in
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