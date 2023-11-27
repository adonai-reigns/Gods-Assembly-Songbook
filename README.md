# Gods-Assembly-Songbook
A Songleader's tool

# Pre-Requisites
You need to install Docker and Docker Compose to run the Development version.

# Run the Development Servers

In a Terminal from the Project's root directory:

1. ```docker-compose up -d```

2. Direct your browser to ```http://localhost```. 

3. The API is accessible at ```http://localhost:8080/api```.

# Adding Node packages

Developers should use the cli tools on the Docker Container to add NPM packages instead of using the host terminal or IDE.

In a Terminal:

1. ```docker exec -it gods-assembly-songbook-dev-1 bash``` 

2. ```cd api``` or ```cd client```, depending whether you want to add packages to the API or the UI.

3. Use ```yarn add [package_name]``` to add the package, or use whatever other commands are recommended by the documentation of [Nest](https://docs.nestjs.com/) and [Astro](https://docs.astro.build/).

6. Commit the changes to your Github fork as you would normally do on the host machine, eg: via the IDE etc.

# Compile Binaries for Distribution

1. ```./GasDevServer_Build.sh```

2. Three binary executable files will be generated into the folder ```/GodsAssemblySongbook```:

- gas-linux
- gas-win
- gas-macos

4. You need to then copy the entire folder ```./GodsAssemblySongbook``` to the computer where you want to run the app. There, you can double-click the file named ```gas-linux``` (or ```gas-win``` if you have Windows).



