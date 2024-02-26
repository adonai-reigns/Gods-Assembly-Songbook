# Gods-Assembly-Songbook
A Songleader's tool

# Running God's Assembly Songbook

You can double-click the file named ```gas-linux``` (or ```gas-win``` if you have Windows). 

# Run the Development Servers

You should not be making changes to the distributable code base. If you want to modify God's Assembly Songbook, you should either clone
or fork the Git repository:

```git clone https://github.com/adonai-reigns/Gods-Assembly-Songbook.git ```

> **_NOTE:_** You need to install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) to run the Development version of God's Assembly Songbook.

In a Terminal from the Project's root directory:

1. ```docker compose up -d``` (or, if you have an old version of docker-compose:) ```docker-compose up -d```

2. Direct your browser to ```http://localhost```. 

3. The API is accessible at ```http://localhost:3000/api```.

# Adding Node packages

Developers should use the cli tools on the Docker Container to add NPM packages instead of using the host terminal or IDE.

In a Terminal:

1. ```docker exec -it gods-assembly-songbook_dev_1 bash``` 

2. ```cd api``` or ```cd client```, depending whether you want to add packages to the API or the UI.

3. Use ```yarn add [package_name]``` to add the package, or if working on /api, use whatever other commands are recommended by the documentation of [Nest](https://docs.nestjs.com/).

6. Commit the changes to your Github fork as you would normally do on the host machine, eg: via the IDE etc.

# Compile Binaries for Distribution

> **_NOTE:_** The build script needs to be executed from within the running Development Docker Container (refer to previous step 1)

1. ```./GasDevServer_Build.sh```

2. Three binary executable files will be generated into the folder ```/GodsAssemblySongbook```:

- gas-linux
- gas-win
- gas-macos

3. You need to then copy the entire folder ```./GodsAssemblySongbook``` to the computer where you want to run the app. 


