+++
title = "Hugo Site on Netlify"
date = 2025-09-09T06:00:00-04:00
draft = false
tags = ["Hugo","Red Hat","Netlify","Homelab","Git","Bitbucket"]
+++
![Netlify](/images/Netlify_logo.png)
Well, it's been a while since I have posted. I realized today that I never posted my transition of moving my self-hosted [Hugo](https://gohugo.io/) generated web site from a Red Hat virtual web server on my homelab to the free-tier hosting on [Netlify](https://www.netlify.com/). This also included finally learning the basics of [Git](https://git-scm.com/) and using a remote Git repository in [Bitbucket](https://bitbucket.org).

It was a surprisingly easy transition, moving from my local server to Netlify. I think the most difficult part, for me, was learning how to get my local Git repo where my Hugo files existed to Bitbucket. I'm not a developer and anything code related, even if it is the simple use of Git, is a bit of a learning hurdle for me. I simply followed the steps from [this site](https://gohugo.io/host-and-deploy/host-on-netlify/), and other resources from my web search, changed the DNS on my domain from my local WAN IP address to point at Netlify's, and all was working. I was really surprised how easy it was to migrate. The only difference was I have a different and simplier netlify.toml config than what I found on the site referenced above. Mine looks like this:

```toml
[build]
  command = "hugo --minify --buildFuture"
  publish = "public"

[build.environment]
  HUGO_VERSION = "0.142.0"
```

Some of you reading this may be asking why I am not self-hosting my site any longer. The simple answer is that I may be moving soon (unknown when at the time of this writing) and I figured if I wanted full uptime on my blog site, even though I doubt I have a large audience, I needed to put it somewhere cheap in the "cloud". In my extensive research, for my purpose, the free-tier of Netlify was the best option. I especially liked the idea of connecting it to a Git repo so that I can post from my laptop while moving or even while traveling.

If you have any questions or comments, please feel free to send me an email noted in my About page.