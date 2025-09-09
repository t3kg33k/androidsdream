+++
title = "Jellyfin and the Beelink Mini S12 Pro"
date = 2024-06-14T06:15:00-04:00
draft = false
tags = ["Linux","Hardware","Jellyfin","AlmaLinux","Red Hat","Ubuntu Server"]
+++
![Beelink S12 Pro](/images/beelink_s12_pro.jpg)

I believe I may have mentioned (but don't fully recall) in a previous post that I was a Plex user for many years. I had it running on my Intel NUC running CentOS then to AlmaLinux then to Red Hat and it worked well without any issues. For the past couple of years or so, I haven't been happy with the direction Plex has been moving, like requiring a "cloud" account in order to view my own local media. Also, adding stuff like Live TV and other membership functions that I don't care about. I just needed something that served up my local media for me to play on all my Roku devices on my LAN. I had tested and played around with Jellyfin about a year ago but I didn't have a very good experience with it then. Well, over the past few months I decided to give it another chance. When I setup the Minisforum NAB5 (mentioned in [previous post](https://www.androidsdream.net/posts/minisforum-nab5-new-vm-host/)), I installed Jellyfin and ran with it for a while. Well, while viewing some high definition movies, I was noticing some crashes of Jellyfin and large skips to a different time frame. Through troubleshooting and research, I discovered that the use of Red Hat 8 on my Minisforum lacked some features that Jellyfin required (e.g. Jellyfin's version of ffmeg) for proper transcoding. If I had done more research ahead of time by reading Jellyfin's own [documentation](https://jellyfin.org/docs/) before setting up Jellyfin on Red Hat I would have read that their configuration works better with Ubuntu.
Fast forward to my discovery of a fellow [Jupiter Broadcasting Linux Unplugged](https://www.jupiterbroadcasting.com/show/linux-unplugged/) podcast listener (412Linux) posting on [his experiences](https://412linux.io/article/beelinks12pro-performance/) with the [Beelink Mini S12 Pro](https://www.bee-link.com/collections/mini-pc/products/beelink-minis-12-pro-intel-n100-processor) and then taking note of how inexpensive that device is on Amazon for less than 200 USD, I decided to purchase the 16GB RAM/500GB storage version for 180 USD. I've since installed Ubuntu 24.04 Server, installed and configured Jellyfin based on Jellyfin's extensive documentation making sure to install the *intel-opencl-icd* and *intel-gpu-tools* package from Ubuntu's repository.

One thing I think it important to note within Jellyfin is that I set these values for Transcoding:

![Jellyfin Transcode](/images/jellyfin_transcode.png)

One hiccup I realized through this process is that I had already configured my media and playlist, along with other personal prefences, in Jellyfin when it was installed on the Minisforum. I needed to be able to migrate all that information from there to the Beelink. To solve that problem, I simply tar'd the following directories on the Minisforum:

`/etc/jellyfin/`

`/var/lib/jellyfin/`

and untar'd them on the Beelink, restarted the service and all was well.
So far, I haven't experienced any major issues in Jellyfin on that Beelink S12 Pro, it's turned into a good buy.

I would like to thank 412Linux on posting that information on his blog and even being kind enough to chat with me on Matrix on the subject. The Linux community is pretty amazing.
