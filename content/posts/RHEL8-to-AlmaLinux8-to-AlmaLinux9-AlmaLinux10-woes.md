+++
title = "RHEL 8 to AlmaLinux 8 to AlmaLinux 9 to AlmaLinux 10 woes"
date = 2026-08-02T09:00:00-04:00
draft = false
tags = ["Linux","Virtualization","AlmaLinux","Red Hat"]
+++
![AlmaLinux](/images/AlmaLinuxlogo.png)

Whoa! I knew it was going to be fun getting from Red Hat Enterprise Linux 8 to AlmaLinux 10, but not this fun.

In previous post, a couple of years ago, I had stated that I had put RHEL 8 on a new Minisforum. Well, as of recently, I have been migrating all my Red Hat Enterprise Linux installs to AlmaLinux on my LAN. Even though I am a RHEL fan, it's just much less hassle to worry about the free Dev subscription license without RHEL being in the mix on my LAN. Well, I have been putting off the migration of my Minisforum for a while; I finally completed it this morning. And not without issues.

I had completed the migration process of RHEL 8 to AlmaLinux 10 on virtual machines without any issues whatsoever. However, there were some levels of complexity with the Minisforum, of course, being a physical machine as well as having a bridge interface configured (for my virtual machines) with legacy network scripts when I first installed RHEL 8 instead of NetworkManager, was one of my first issues. Luckily, the [ELevate leapp](https://wiki.almalinux.org/elevate/ELevate-quickstart-guide.html) utility pointed out a couple of Red Hat KB articles I could use to fix the problems. After some additional issues following those articles, I ended up having to completely delete my bridge interface and renaming my Ethernet interfaces from eth0 to my own custom label using udev rules. Once I completed those steps as well as remove some packages that wouldn't upgrade due to some security issues, the migration finally succeeded. But, the fun didn't end there.

Upgrading from AlmaLinux 8 to AlmaLinux 9 one would think would be smoother. Using the leapp utility again, as one should do, it kept griping with some crazy errors. I attempted to remove the leapp packages but even then I kept receiving those crazy errors. The only thing that would fix the issue and allow me to remove the leapp utility was to remove it from the exclude list in /etc/dnf/dnf.conf. Once I did that I was able to remove it and reinstall to proceed with the upgrade to AlmaLinux 9. Oh, but the hits keep coming.

Once I was on AlmaLinux 9 and attempted to upgrade to AlmaLinux 10, the leapp utility gripped about my native NVMe multipathing setting. Apparently, it was disabled and it needed to be enabled. Again, following the necessary Red Hat article I was able to enable it in the kernel and proceed with upgrading to AlmaLinux 10.

Learning experiences. That's what I call these. In retrospect, I was definitely complaining about the woes during the migration process. But, now that it is over I appreciate the experience and would not change anything. My success rate, really, with using the ELevate utility to migrate to AlmaLinux is actually pretty high. This one experience is the only time out of, what, maybe ten times that I have had an issue. So, really, no complaints.

If you have any questions or comments, please feel free to send me an email noted in my About page.
