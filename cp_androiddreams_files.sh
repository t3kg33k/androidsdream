#!/bin/bash
# Copy web files to androidsdream.net
echo " About to copy files"
echo
sleep 1
cd /home/ed/hugo_sites/androidsdream.net || exit

scp -r public/* root@pris:/var/www/androidsdream/

ssh -t root@pris chown apache:apache -R /var/www/androidsdream
echo
echo " FILES COPIES"
