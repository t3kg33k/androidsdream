+++
title = "rclone Backblaze B2 Cloud Backup"
date = 2026-03-12T06:00:00-04:00
draft = false
tags = ["Linux","rclone","Backups"]
+++
I've discussed using rclone in [previous post](https://www.androidsdream.net/posts/rclone-google-drive-cloud-backup/). Well, since I'm getting close to filling up some storage locally, and hard drive prices are currently astronmically high right now, I figured I would check out affordable cloud storage to send some of my data that I don't access often to long-term storage using Backblaze B2. And the reason I have chosen Backblaze B2 over Google Drive is that I am slowly migrating all services I use away from Google. One major issue I have with Google Drive is that it doesn't have the level of encryption that Backblaze has for keeping my data safe.

If you visit Backblaze B2 page and check out their pricing, it's really affordable. You even have the option to start storing 10GB at no cost. The plan looks to be a pay as you use scenario with it being as low as $6 a month for 1TB. Not bad, in my opinion. If you need off-site storage of archival data, or data you hardly touch, it seems this is a really affordable option.

To start, I recommend, first, signing up for [Backblaze B2 Cloud Storage](https://www.backblaze.com/cloud-storage). From there, you should install [rclone](https://rclone.org), if you do not already have it installed. And then to assist with rclone and Backblaze B2, check out this really good video on Backblaze's YouTube channel: [Getting Started with Rclone and Backblaze B2](https://www.youtube.com/watch?v=r1ruNWy3B00)

In a nutshell, this is what I did once I had an account (below is a copy/paste, and edited, from my personal notes after following along the YouTube video mentioned above):

1. Create and record an Application key (and store in a safe place - Tip: in a preferred password manager) after signing into Backblaze B2. NOTE: Record KeyID also
2. Install rclone, if not already installed.
3. Run the following from CLI

	```rclone config```

	
	n) New remote > b2 # 'b2' being a generic label to identify the remote connection

	b2 Backblaze B2  # Assuming that the current config of rclone's #5 b2 choice is Backblaze B2

	keyID # This was generated in step 1 above

	application_key # This was generated in step 1 above

	false # Hit Enter for default of 'false' for hard delete

	n # Hit Enter for default of 'No' for Advanced Config

	y # Hit Enter for default of 'Yes' to keep the "b2" remote

	q # Select 'q' to Quit the config

4. Run the following command to list the buckets in the remote 'b2' connection

	```rclone lsd b2: --fast-list```

	OPTIONAL: Setup the following environment variable to automatically use the ```--fast-list``` option

	```export RCLONE_FAST_LIST=true```

    #NOTE: Using the ```--fast-list``` option reduces the number of API calls to Backblaze to reduce cost.

5. Run the following command to create a new bucket in B2

	```rclone mkdir b2:test-bucket```

	OPTIONAL: A bucket can also be created on Backblaze's web portal once you login. Encryption can also be enabled there.

6. To backup a directory to your B2 bucket, run the following command:

	```rclone copy local_directory b2:test-bucket/ -P``` # The '-P' option displays progress

If you have any questions or comments, please feel free to send me an email noted in my About page.
