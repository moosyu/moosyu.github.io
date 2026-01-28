---
title: "Convert webp to jpg bash script"
pubDate: 2024-05-18
---

Go to the folder where the files you wanna convert are.

Enter this script = "for x in ls *.webp; do ffmpeg -i $x ${x%.webp}.jpg; done" (dont add the quotations).

Done :sunglasses: (if you get the ffmpeg: command not found error you need to get ffmpeg. go [here](https://ffmpeg.org/download.html) to get it).