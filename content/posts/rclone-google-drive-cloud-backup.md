+++
title = "rclone Google Drive Cloud Backup"
date = 2024-07-23T06:00:00-04:00
draft = false
tags = ["Linux","rclone","Backups"]
+++
In my backup strategy I have a few tiers of backup for restore scenarios. I have my primary data folder that syncs to my Nextcloud server on my home network using the Nextcloud client. This is so I can sync that same data to multiple devices on my LAN, even while I am off my LAN using my Tailscale network. That Nextcloud instance has a NFS share mounted from my 8TB Synology NAS (one of these days I'll post about my Nextcloud setup). At the same time I also rsync that same data folder to a separate directory on my Synology NAS and that directory on the NAS, and everything else, also rsyncs to an external 8TB USB drive; all scheduled to be completed twice a week via a crontab. So that I have off-site backup of my primary data folder, I also use a service called [MEGA](https://mega.io/). I've been using it for over a year and have not had any issues with it, until now.

I recently, finally, upgraded my main desktop computer after having last upgraded over 9 years ago (see [previous post](https://www.androidsdream.net/posts/new-pc-build/)). In this new desktop, I have a second 2TB NVME drive mounted for just my primary data folder. After installing the MEGA client and pointing it to my main data folder on that drive I get an error message that the files can't sync. Apparently this is a known issue per their [GitHub issue tracker](https://github.com/meganz/MEGAsync/issues/844) and they have been working on a fix, per the open case I have with their support.

In the meantime, I needed an alternative cloud backup option for off-site backups. I have had a 2TB Google Drive for many years and I have barely used a quarter of it. I don't have a lot of high priority data, about 400GB, so Google Drive is a good temporary alternative until MEGA gets their sh** together. Since I use Linux as my daily driver, Google has not created a Linux client to sync data to Google Drive. However, rclone works really well in this area to allow for mounting of that Google Drive. There are tons of articles and video tutorials ([good example](https://youtu.be/ff8Ogk8NIPU?si=wZDLPVE1nvqGW_pP)) on how to set this up so I used those resources to mount my Google Drive and began my copy process using rsync. Because I don't change files that I often, I currently don't have off-site backups scheduled in my crontab. Every so often (about once a week) I run the following Bash script:

```bash
#!/bin/bash

#
# This script checks to see if already configured gdrive via rclone is mounted first before completing a backup
MNTSHARE=$(mount | grep gdrive | awk '{print $3}')

if [ "$MNTSHARE" == /path/to/mounted/Google_Drive ];
        then
        echo
        echo "*** GDrive is mounted. Proceeding with backup. ***"
        echo
        # rsync commmand with directory exclusion
        rsync -av --exclude=<excluded_directory> --log-file=/path/to/logs/gdrive_"$(date +%Y%m%d_%H%M%S)".log $HOME/files/ /path/to/mounted/Google_Drive

elif
        [ "$MNTSHARE" != /path/to/mounted/Google_Drive ];
        then
                echo
                echo "*** GDrive is not mounted. Mounting... ***"
                echo
                # rclone command to mount already configured Google Drive
                rclone mount --daemon gdrive:/rclone /path/to/mounted/Google_Drive
                echo "*** Mounted. Proceeding with backup. ***"
                echo
                rsync -av --exclude=<excluded_directory> --log-file=/path/to/logs/gdrive_"$(date +%Y%m%d_%H%M%S)".log $HOME/files/ /path/to/mounted/Google_Drive
fi

echo
echo "*** Done ***"

```

If you have any questions or comments, please feel free to send me an email noted in my About page.
