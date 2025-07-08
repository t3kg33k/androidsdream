+++
title = "Podman Rootless Container Start on Boot"
date = 2025-06-04T05:46:00-04:00
draft = false
tags = ["Linux","Podman","Containers","Homelab"]
+++
![Podman](/images/podman-logo.png)

I've been a Docker user for years. I've never been an expert, I've only used it enough to get by in deploying Containers on my home lab for self-hosting services. Recently, I decided it was time to use Podman instead of Docker just so I could learn the differences. The major differences, as I understand it, is that Podman is more secure due to the ability of deploying a rootless container. So, I setup a new virtual machine running AlmaLinux 9, installed all the Podman packages and proceeded with, first, setting up Homarr dashboard using a Docker compose file. I deployed it as usual; this time using the *podman-compose* command instead of *docker-compose* using a standard non-root user. From there, I decided to migrate a couple of other containers (Freshrss and flatnote) from a different machine where they had been running as a Docker container to the new virtual machine running Podman and they all started up nicely. What I had found, so far, is that most things translate easily from Docker to Podman. Fair enough, easy enough.

But then I discovered, after a reboot of my virtual machine, that my Homarr dashboard wasn't up. I logged in with my user account, ran the *podman ps -a* command and noticed that all three containers were not running. Long story short, in my research I found that Podman containers do not start up at boot due to there not being a daemon. The only way to fix this was to create a systemd unit file under the standard user's profile. At first, I had found articles and blog post that you have to use the command *podman generate* on that specific container and it would create a systemd file for you, like this:

```text
podman generate systemd --new --name homarr
```

However, when I ran the command, this warning popped up:

```text
DEPRECATED command:
It is recommended to use Quadlets for running containers and pods under systemd.
```

Of course, this required further research on Quadlets. To keep this blog post short, after numerous articles and blog post, time and again, I discovered that most were creating a systemd file for each container. To me, that seemed ineffecient. Finally, I discovered a forum post (I believe it was the Bazzite forum) in which someone created a systemd file that started all containers at boot. During my own trial and error of creating the file named *podman-restart.service*, this is what I came up with, based on that user's file, that seems to be working just fine once I placed it in my users home directory in /home/user/.config/systemd/user/:


```yaml
[Unit]
Description=Podman Start All Containers
StartLimitIntervalSec=0
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
RemainAfterExit=true
ExecStart=/usr/bin/podman start --all
ExecStop=/usr/bin/podman stop --all

[Install]
WantedBy=default.target
```

Ran the following command:

```text
systemctl --user daemon-reload
```

and enabled the service with this command:

```text
systemctl --user enable podman-restart.service
```

For the expert Podman users out there, I am sure there is a better way to do this but this seems to be working for me so I will stick with this plan going forward, if I decide to continue using Podman. If there is a better way, I welcome your input.

If you have any questions or comments, please feel free to send me an email noted in my About page.
