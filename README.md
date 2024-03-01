# Gods-Assembly-Songbook™️
A Songleader's tool

![Screenshot of the songleader's home page.](/client/public/images/screenshots/March_2024/songleader-menu.png)

This app puts the slides back in the hands of the songleader where they belong! 

The idea is that the songleader has their iPad on their music stand on stage and they can choose any slide from any song on the playlist at any time. 

![Screenshot of the songleader's home page.](/client/public/images/screenshots/March_2024/songleader.png)

Whatever slide is currently live is what the Audience's screen shows, and the songleader can select any slide from any song to play next. 

It even works well with presentation clickers!

View more screenshots here: [client/public/images/screenshots/March_2024/](client/public/images/screenshots/March_2024/)

---
> :free: God's Assembly Songbook™️ is free software and it's all Open-Source, because God gave me the talent and the good health to do it. I enjoy coding and this is one of the things that I like to do with the life that He gave me :partying_face:

# Running God's Assembly Songbook™️

You can double-click the file named ```gas-linux``` (or ```gas-win``` if you have Windows). 

It should open up your default browser automatically, but if you need to go there manually, just type [http://localhost](http://localhost) into the URL bar.

On the [settings page](/client/public/images/screenshots/March_2024/audience-settings.png) you will see the Application URL. Anyone can open that page in their browser as long as they're connected to the same network.

That's how the songleader can use it from their iPad on stage.

> [!IMPORTANT]
> You need to have ports 80 and 3000 open. Sometimes people configure the firewall to block these ports because only website servers need to use them. God's Assembly Songbook™️ is actually a website that you are running on your own computer. 

For the projector screen, simply click on the "Audience" tab at the home page and click the button to go to full-screen view.

You can go in and out of fullscreen view by pressing the ```F11``` key in the browser.

![](/client/public/images/screenshots/March_2024/audience-view-2.png)

---

> [!NOTE]
> the following information is for developers only and it uses advanced computer language

![](/client/public/images/anotherlibraryguy_code-screen/code-fade-cropped.png)

# Run the Development Servers

You should not be making changes to the distributable code base. If you want to modify God's Assembly Songbook™️, you should either clone or fork the Git repository:

```git clone https://github.com/adonai-reigns/Gods-Assembly-Songbook.git ```

> [!IMPORTANT]
> You need to install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) to run the Development version of God's Assembly Songbook™️.

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

> [!TIP] 
> The build script needs to be executed from within the running Development Docker Container (refer to previous step 1)

1. ```./GasDevServer_Build.sh```

2. Three binary executable files will be generated into the folder ```/GodsAssemblySongbook```:

- gas-linux
- gas-win
- gas-macos

3. You need to then copy the entire folder ```./GodsAssemblySongbook``` to the computer where you want to run the app. 

---
:pray: want more? read [/ROADMAP.md](/ROADMAP.md)

---

©️ God's Assembly Songbook - free software for church worship - available at [www.github.com](https://github.com/adonai-reigns/Gods-Assembly-Songbook/)
