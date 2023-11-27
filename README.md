# Gods-Assembly-Songbook
A Songleader's tool

# Pre-Requisites
You need to install Docker and Docker Compose to run the Development version.

# Run the Development Servers

In a Terminal from the Project's root directory:

1. ```docker-compose up -d```

2. Direct your browser to ```http://localhost```. 

3. The API is accessible at ```http://localhost:8080/api```.

#Compile Binaries for Distribution

1. ```./GasDevServer_Build.sh```

2. Three binary executable files will be generated into the folder ```/GodsAssemblySongbook```:

- gas-linux
- gas-win
- gas-macos

4. You need to then copy the entire folder ```./GodsAssemblySongbook``` to the computer where you want to run the app. There, you can double-click the file named ```gas-linux``` (or ```gas-win``` if you have Windows).



