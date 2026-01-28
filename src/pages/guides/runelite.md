---
title: "Running runelite off a USB flash drive"
pubDate: 2022-12-07
---

(This guide assumes you're using Windows)

Prerequisite: a flash drive with 1gb of space or more and wherever you are going to plug it in doesn't block Runescape's servers

Step 1: Go to [Temurin latest releases page](https://adoptium.net/temurin/releases/?version=11) and download the OpenJDK windows version in the zip format. Then unzip and place it in your folder. I renamed it to Java but you can name it whatever you prefer.

![Screenshot of Runelite github releases](/assets/runelite_site.avif)

Step 2: Go to the [Runelite github releases page](https://github.com/runelite/launcher/releases) and download the Jar version.

Step 3: Make a bat file (the name doesnt matter) and in it place this script:

```bash
D:\Java\bin\java.exe "-Duser.home=client-home -Djava.io.tmpdir=client-tmp" -jar D:\client-runelite\RuneLite.jar --nojvm
```

Replace the beginning D:\Java\bin\java.exe with your flash drives java.exe location and replace this part near the end D:\client-runelite\RuneLite.jar with your flash drives Runelite.jar location.

The quotation marks around "-Duser.home=client-home -Djava.io.tmpdir=client-tmp" are for if you are running it with Powershell. If you are using command prompt they aren't necessary.

Then run your new bat file to boot Runelite off your flash drive.