+++
title = "Home Network"
date = 2024-03-11T08:15:45-04:00
draft = false
tags = ["Homelab"]
+++
Before I move forward with discussing events on my network and any cool new items I discover that I may want to post on this blog, I figure I would give you an idea of what I have setup as of today as a frame of reference. One thing that I have discovered over the years, though, is that my home lab is very dynamic.
The visual diagram below depicts a very basic setup of my LAN. A few things it does not display is the separate (segmented) VLAN I have setup for all my IoT devices, a number of wireless devices that I have on my default VLAN (Roku, smartphones, tablets, printers, etc.) and the [Tailscale](https://tailscale.com/) network running on some of my nodes. In regards to the Tailscale network, just know that a few of the devices displayed below have services running that are only available on my Tailscale network (e.g. Nextcloud, Rustdesk). I am sure there is room for improvement and there are probably a few things I am doing wrong. But I am learning something new almost every day and that is why I find my LAN can be so dynamic.

![Diagram](/images/home_network_generic.png)

NOTE: If you are not familiar with Tailscale I highly recommend checking it out and trying it for yourself. I'm sure you can find plenty of resources online but here is a video I found that explains it pretty well: [TailScale - Your Own Virtual Private Network](https://www.youtube.com/watch?v=jDYyC9gF774&ab_channel=DBTech)

Another good video on the Tailscale channel: [How to get started with Tailscale in under 10 minutes](https://www.youtube.com/watch?v=sPdvyR7bLqI&ab_channel=Tailscale)
