+++
title = "Home Server Monitoring with Cockpit and Landscape"
date = 2024-09-18T17:30:00-04:00
draft = false
tags = ["Linux","monitoring","Red Hat","Ubuntu Server"]
+++
Server monitoring has many levels. From my own personal experience, in the I.T. world as a Systems Administrator, I have used many products for such purposes (e.g. SolarWinds). You can monitor servers for simply their availability status. Or, you can get as detailed as monitoring performance and resource statistics. On my home network, I have tried many solutions from Nagios to Zabbix to Checkmk. All have been solid solutions but, truthfully, a bit of overkill. At the moment, the most basic monitoring I have in place is Uptime Kuma internally that sends notifications to Discord if a server goes down. Externally, since I self-host my own web server (here), I use the free version of UptimeRobot for up time with notifications straight to my email.

Recently, I have reconsidered server monitoring beyond simple uptime and was looking for more simplistic solutions than Zabbix or Nagios. In my research I discovered that I really didn't need to venture further than what was already in place that came with the operating systems that I use on my home servers. All of my servers, except one, use Red Hat Enterprise Linux (with free Developer license); the one exception runs Ubuntu Server 24.04.

For RHEL, Cockpit can be installed and enabled on each server. And, I have found that it has been more than I need. The downside is that I have to connect to each server to view the performance metrics instead of viewing through a single pane dashboard for all servers (hopefully, Red Hat will come up with a solution in the future to satisfy this requirement). Also, so far that I have found, there is no way to setup notifications within Cockpit.

For Ubuntu Server, there is Landscape. However, Landscape requires a Pro account for use. But, what most people don't realize, is that you don't have to pay for an Ubuntu Pro account in order to take advantage of this service. Available to all outside the Enterprise is a free account that allows for personal subscription for up to 5 machines. And this doesn't just apply to servers, Landscape can also monitor Ubuntu workstation. So, in other words, if you have Ubuntu servers and workstations on your home network that equal less than 6, you can deploy a Landscape server to manage and monitor all your Ubuntu devices. You can sign up for Ubuntu Pro [here](https://ubuntu.com/pro).

One thing I wanted to make note of in this post are the steps that I used to setup Landscape, since I ran into some snags, as you may discover also if you decide to setup Landscape.

First, of course, is to install Ubuntu Server. For my home network I chose to deploy this on a virtual machine. Then, sign up for Ubuntu Pro. Once you log into your Pro Dashboard you will see a token that will be used when you register your servers and workstations. [Ubuntu's documentation](https://documentation.ubuntu.com/pro/pro-client/how_to_attach/#attach) is pretty good but essentially you connect by running these command:

`pro attach token` # Enter token from your Pro dashboard

Then install the Pro client:

`apt install ubuntu-pro-client -y`

Then to complete a non-interactive install of Landscape on your server you will need run the following commands:

`apt update && sudo apt install -y ca-certificates software-properties-common`

`add-apt-repository -y ppa:landscape/self-hosted-24.04`

`apt update && apt upgrade -y`

`DEBIAN_FRONTEND=noninteractive apt-get install -y landscape-server-quickstart`

Then copy the Landscape server cert to your client machine:

`scp /etc/ssl/certs/landscape_server_ca.crt username@client:/usr/local/share/`

On the client side, you will need to run these commands after also attaching to your Pro account and installing the Pro client (see steps above):

`apt update && sudo apt install -y ca-certificates software-properties-common`

`apt install landscape-client -y`

`update-ca-certificates` # To ensure refresh after copying the cert from the server (see above)

Below, replace "server_label" with a label of your preference and also your Landscape server IP in the URLs.

`landscape-config --computer-title "server_label" --account-name standalone  --url https://your_landscape_server_ip/message-system --ping-url http://your_landscape_server_ip/ping` # This is all one line

Once you log into your Landscape server by accessing the *https://your_landscape_server_ip* URL you should be able to see and manage your new client.

These steps are very basic and you can find plenty of documentation out there on how to setup Cockpit and Landscape. I just wanted to point out specifically for the Landscape setup the process of copying the server cert to the client as it is not really well documented.

If you have any questions or comments, please feel free to send me an email noted in my About page.
