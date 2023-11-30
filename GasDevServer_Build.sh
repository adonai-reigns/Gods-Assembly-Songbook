#!/bin/bash

#####
# A script that runs when the server boots up, that installs dependencies and starts the services
#####

echo "#############   Gas Development Server   #############"
echo "  building distributable app.."
sleep 2
echo "  please be patient, this can take several minutes.."
sleep 1
echo ""

APP_DIR=/home/node/app

echo "cd $APP_DIR/api"
cd $APP_DIR/api

echo ""
echo "Building API"
echo "  yarn run build"
yarn run build

echo ""
echo "cd $APP_DIR/client"
cd $APP_DIR/client

echo "Building Client"
echo "  yarn run build"
yarn run build

echo ""
echo "Copying generated files to GodsAssemblySongbook folder"
echo ""
echo "  cd $APP_DIR"
cd $APP_DIR

echo "  rm -rf $APP_DIR/GodsAssemblySongbook/api"
rm -rf $APP_DIR/GodsAssemblySongbook/api*

echo "  cp $APP_DIR/api/dist $APP_DIR/GodsAssemblySongbook/api"
cp -r $APP_DIR/api/dist $APP_DIR/GodsAssemblySongbook/api

echo "  rm -rf $APP_DIR/GodsAssemblySongbook/client"
rm -rf $APP_DIR/GodsAssemblySongbook/client

echo "  cp $APP_DIR/client/dist $APP_DIR/GodsAssemblySongbook/client"
cp -r $APP_DIR/client/dist $APP_DIR/GodsAssemblySongbook/client

echo "Updating packages for distribution"
echo "  cd $APP_DIR/GodsAssemblySongbook"
cd $APP_DIR/GodsAssemblySongbook
echo "  yarn install"
yarn install

echo ""
echo "Running npm pkg script"
echo "  pkg -t node16-linux $APP_DIR/GodsAssemblySongbook/. --out-path $APP_DIR/GodsAssemblySongbook/"
pkg -t node16-linux,node16-win,node16-macos $APP_DIR/GodsAssemblySongbook/. --out-path $APP_DIR/GodsAssemblySongbook/

echo ""
echo "#################   !! CONGRATULATIONS !!   ######################"
echo "          Build is finished!                                      "
echo "          Executable files are found at ./GodsAssemblySongbook/                  "
echo "##################################################################"
echo ""

