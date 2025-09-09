+++
title = "Raspberry Pi Kiosk Photo Album"
date = 2024-02-15T08:15:45-04:00
draft = false
tags = ["Linux","Shell script","Hardware","Homelab","Kiosk"]
+++
![Raspberry Pi 3](/images/rasppi-kiosk.jpg)
A while back I had purchased an [Eyoyo 7 inch mini HDMI monitor](https://a.co/d/1VzMgkl) to use on my physical servers on my home network. I usually setup headless configuration on my servers but I still need to be able to see what I am doing when I install the operating system (I haven't had the time yet to configure automated install) or troubleshoot an issue. Well the monitor has been sitting on my home office desk, most of the time, doing nothing. I also had a Raspberry Pi 3 sitting around doing nothing so I decided it was time to setup a makeshift photo frame for my desk. I ended up following the usual guides found everywhere for configuring Raspberry Pi OS in kiosk mode and partially how to setup the feh utility for the image viewer in this [guide](https://pimylifeup.com/raspberry-pi-photo-frame/). In the article I followed the steps to disable screen blanking. I figured out, though, that I needed to add the following:

`xserver-command=X -s 0 –dpms`

to the [Seat:*] section in /etc/lightdm/lightdm.conf.
Once that was done, I copied all the picture files I wanted into the Pictures directory in my home directory (/home/ed/Pictures) and then created this shell script:

```bash
#!/bin/sh
cd /home/ed/Pictures/
feh -Z -z -F -D 300 --hide-pointer --auto-rotate
```

And just for reference, the options for the feh command are these (which can be found in the man pages for the utility):

```text
Z = auto zoom
z = randomize
F = fullscreen
D = slideshow delay
```

With that shell script in my home directory (making sure it was executable), I appended it to the bottom of /etc/xdg/lxsession/LXDE-pi/autostart. Once completed, I rebooted and all works.

![digital photo frame](/images/baby_read.png)