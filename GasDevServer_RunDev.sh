#!/bin/bash

#####
# The Docker Container Entrypoint script that runs when the server boots up. 
# Installs dependencies and starts the services.
#####

echo "#############   Gas Development Server   #############"
echo "  checking installation.."
sleep 2
echo "  please be patient, this can take several minutes.."
sleep 1
echo ""
APP_DIR=/home/node/app

echo "Change Directory to $APP_DIR"
cd $APP_DIR

if [ -f "yarn.lock" ]; then
    echo "  yarn.lock file exists, skipping installation..."
else 
    echo "  yarn.lock file does not exist, let us run the installation."
    echo "  yarn install"
    yarn install
fi

if [ -d "node_modules" ]; then
    echo "  node_modules is a directory, not running installation again."
else
    echo "  node_modules is not a directory, let us run the installation again."
    echo "  yarn install --immutable"
    yarn install --immutable
fi

echo "Change Directory to $APP_DIR/api"
cd $APP_DIR/api

if [ -f "yarn.lock" ]; then
    echo "  yarn.lock file exists, skipping installation..."
else 
    echo "  yarn.lock file does not exist, let us run the installation."
    echo "  yarn install"
    yarn install
fi

if [ -d "node_modules" ]; then
    echo "  node_modules is a directory, not running installation again."
else
    echo "  node_modules is not a directory, let us run the installation again."
    echo "  yarn install --immutable"
    yarn install --immutable
fi

echo "Change Directory to $APP_DIR/client"
cd $APP_DIR/client

if [ -f "yarn.lock" ]; then
    echo "  yarn.lock file exists, skipping installation..."
else 
    echo "  yarn.lock file does not exist, let us run the installation."
    echo "  yarn install"
    yarn install
fi

if [ -d "node_modules" ]; then
    echo "  node_modules is a directory, not running installation again."
else
    echo "  node_modules is not a directory, let us run the installation again."
    echo "  yarn install --immutable"
    yarn install --immutable
fi

echo "Change Directory to $APP_DIR"
cd $APP_DIR

echo "  Run Nest Server in dev watch Mode"
cd $APP_DIR/api
echo "    yarn run start --watch &"
yarn run start --watch &

echo "  Run Client Server in dev watch Mode"
cd $APP_DIR/client
echo "    yarn dev &"
yarn dev &

if [[ -v LEGACY_DEV && $LEGACY_DEV == 1 ]]; then
    echo "  Run Legacy Client Server $LEGACY_DEV in watch Mode on port $LEGACY_DEV_PORT"
    cd $APP_DIR/client
    nodemon -e js,ts,jsx,tsx,html,svg,css,scss --watch src --watch public --exec "yarn run build && npx http-server ./dist/ -o --cors --mimetypes ../GodsAssemblySongbook/mime.types -a 0.0.0.0 -p $LEGACY_DEV_PORT"
fi

cd $APP_DIR
echo ""
echo "#################   !! CONGRATULATIONS !!   ######################"
echo "          Gas Development Server runs on your computer!           "
echo "             Visit http://localhost in your browser               "
echo "  Optional:                                                       "
echo "    To run the dev stack in legacy mode, set the env variables:   "
echo "      eg: LEGACY_DEV=1 LEGACY_DEV_PORT=8080 docker-compose up     "
echo "##################################################################"
echo ""
echo "The following is output from the servers as they run:"
echo ""

while true; do sleep 1; done


