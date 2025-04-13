+++
title = "Ghost Blogging Busting"
date = 2024-04-01T08:15:45-04:00
draft = false
tags = ["News"]
+++
I moved from Ghost blogging plaform self-hosted on one of my servers at home using a Docker compose file to the simplified use of a static site generator that is [Hugo](https://gohugo.io/). There was quite a bit of a learning curve being that I am not a developer but YouTube and other resources on the internet were instrumental in helping me set everything up. Now, I just have Hugo installed on my Fedora workstation and a RHEL 8 web server for posting all the files that Hugo generates.

The issue with Ghost is that it seemed that it was more than I needed and not as easily customizable. With Hugo, all that you really need to know is markdown. One caveat that really threw me for a loop when I was searching for a good theme on [Hugo's theme page](https://themes.gohugo.io/) is that a majority of the theme developers required you to know Git and the workings of Github. As stated before, I am not a developer so I don't use Git or Github extensively (although I've been saying for years I really need to learn it just for my script library alone) so it took a bit of time and trial & error until I could find a good theme that had simple instructions and implementation (currently using [Poison theme](https://themes.gohugo.io/themes/poison/)).

However, even though it is running now, there are still some tweaks and fixes I need to complete (currently, tags are a problem), and other issues I haven't discovered yet, that will need to be corrected in the coming months of use.
