---
title: "Everything is tiny after installing AwesomeWM"
pubDate: 2022-12-07
---

![picture of it](https://i.redd.it/p8k2wq7ntxv91.png)

Press windows key+enter to open a terminal. Then run the command touch ~/.Xresources to create a file Xresources then edit it with vim or nano (or any other command line based editor).

Run the command windows key+p and enter the name of your browser of choice though you may be unable to see what you are typing.

![dpi.lv screenshot](/assets/dpi.lv.png)

After opening a browser enter the url dpi.lv and copy its pixels per inch result. its 166 for me.

In your file ~/.Xresources type Xft.dpi: 166 but replace 166 with your pixels per inch you just got.

After saving ~/.Xresources press windows key + control + r to reload awesome and your problem should be fixed!