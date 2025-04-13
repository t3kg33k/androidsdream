+++
title = "Beelink Mini S12 Faulty Network"
date = 2024-09-27T15:30:00-04:00
draft = false
tags = ["Linux","Hardware"]
+++

I recently purchased a second Beelink mini S12; mainly because it was such a good deal for $140 USD that I couldn't pass up. The difference in this model versus the S12 Pro I had purchased for my Jellyfin server (see [previous post](https://www.androidsdream.net/posts/jellyfin-and-the-beelink-s12-pro/)), is that the S12 Pro is an Intel N100 while the S12 is an Intel N95. Well, it is true that you get what you pay for. The S12 (N95) has a bad wired network interface.

I discovered this issue this past week when I attempted to install AlmaLinux 9 on the S12 with the intent of setting up a CUPS server for my Brother ink jet printer. I had noticed in the past few weeks that print jobs sent to the printer over Wi-Fi were either taking forever to print, or not printing at all. I notched this issue down that the Wi-Fi piece of the printer is potentially degrading. So, I figured I could setup a print server and connect the printer via USB for my network printing needs.

Well, during the install of AlmaLinux on the S12 I setup a static IP address within Anaconda but noticed that there wasn't a connection. I thought nothing of it. Once the install completed and the server rebooted into the operating system, I could never connect to it via ssh. And once I logged in at the console I noticed the static IP was configured but I couldn't ping the gateway. After trying to plug it in with different cables on different ports on multiple switches I came to the conclusion there was something wrong with the wired interface. Another clue that popped up is that I was noticing a burning smell coming from the S12. I even went as far as restoring the factory Windows 11 image that came with the S12 (thank you, Clonezilla; I normally have a practice of imaging the factory operating system for archival everytime I get a new computer) but even then it would not grab an IP from DHCP within Windows. One thing interesting is that the NIC displayed correctly as being available in all the operating systems I had tried (a few times even booted into Live USB versions of Ubuntu and Fedora) but the NIC would never grab an IP address from DHCP.

After a few email exchanges with Beelink support that included a new BIOS update recommendation, it was determined that it truly is a faulty unit (Hello! Burning smell) and I am sending it back to them for a replacement. After researching on the internet, it seems it is not uncommon for Beelink to have problems with their units. Hopefully the replacement they send me will work without issues. So far, the S12 Pro has been working flawlessly for the past few months.

I say all of that to say this: be warned that in purchasing a Beelink mini PC that you may run into issues, your mileage may vary. I'm still on the fence about their reliability and am not entirely sure if I will buy another Beelink again. I guess it will depend on the price. Again, I only paid 140 USD for the S12. 140 USD for a brand new PC. In that, you will either get a good deal, or a bad egg. I would like to think I got both.

If you have any questions or comments, please feel free to send me an email noted in my About page.
