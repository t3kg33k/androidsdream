+++
title = "Fedora & Debian Photo Album Kiosk"
date = 2024-11-07T15:30:00-05:00
draft = false
tags = ["Linux","Fedora","Debian","Shell script","Hardware","Homelab","Kiosk"]
+++

I [previously posted](https://www.androidsdream.net/posts/raspberry-pi-kiosk/) about setting up a Raspberry Pi with Raspbian 11 as a photo album kiosk. Since then I wanted to test completing the same setup with Debian and Fedora on an x86 machine, just in case my Raspberry Pi died, or if I decided I needed a faster machine and wanted to use my spare Beelink S12. This a great setup if you have a spare machine and monitor lying around for displaying family photos (again, see previously post to see my example). Well, in testing on a virtual machine I came up with these basic steps below.

## For Debian

*NOTE: The following steps were tested with Debian 12.6

1\. During install select LXDE as the DE and SSH server. Others are optional.

2\. Ensure user has lxde selected as DE when first logging in after OS install

3\. Create directory to hold pictures.

`sudo mkdir /pics`

`sudo chmod 777 -R /pics`

4\. Create shell script and add execute permissions in home directory with following:

```bash
#!/bin/bash
cd /pics
feh -Z -z -F -D 300 --hide-pointer --auto-rotate
```

NOTE:
Z = auto zoom
z = randomize
F = fullscreen
D = slideshow delay in seconds

`chmod 775 /home/<yourusername>/kiosk.sh`

5\. Install feh utility

`sudo apt install feh`

6\. Update /etc/lightdm/lightdm.conf with this in the [Seat:*] section:

`xserver-command=X -s 0 –dpms`

`autologin-user=<yourusername>`

`autologin-user-timeout=0`

7\. Edit .config/lxsession/LXDE/autostart in the user's home directory and add the shell script from step 4 above at the bottom:

`/home/<yourusername>/kiosk.sh`

8\. Reboot

OPTIONAL: Browse pictures using SAMBA

1\. Install Samba

`sudo apt install samba samba-common -y`

2\. Make backup of original

`sudo cp /etc/samba/smb.conf /etc/samba/smb.bk`

3\. Edit original file, remove all and add the following

```text
[global]
        map to guest = Bad User
        log file = /var/log/samba/%m
        log level = 1
        server role = standalone server

[guest]
        # This share allows anonymous (guest) access
        # without authentication!
        path = /pics
        read only = no
        guest ok = yes
        guest only = yes
```

4\. Enable and start the service

`sudo systemctl enable --now smb.service`

## Below are the similar steps for Fedora

*NOTE: Tested with both Fedora 40 & 41 LXQt Spin

1\. Install Fedora LXQt from Fedora's Spin.

2\. Ensure user has lxqt selected as DE when first logging in after OS install

*OPTIONAL: Disable firewalld and SELinux

3\. Create directory to hold pictures

`sudo mkdir /pics`

`sudo chmod 777 -R /pics`

4\. Create shell script and add execute permissions in home directory with following:

```bash
#!/bin/bash
cd /pics
feh -ZF -z -D 300 --hide-pointer
```

NOTE:
Z = auto zoom
z = randomize
F = fullscreen
D = slideshow delay in seconds

`chmod 775 /home/<yourusername>/kiosk.sh`

5\. Install feh utility

`sudo dnf install feh`

6\. In order to use lightdm instead of lxQt, I had to complete this install and config:

`sudo systemctl disable sddm.service`

`sudo dnf install lightdm-gtk -y`

`sudo systemctl enable lightdm.service`

`sudo dnf install lightdm-gtk-greeter-settings -y`

7\. Update /etc/lightdm/lightdm.conf with this in the [Seat:*] section:

`xserver-command=X -s 0 –dpms`

`autologin-user=<yourusername>`

`autologin-user-timeout=0`

8\. Add kiosk.sh shell script to Preferences>Session Settings>Autostart>LxQt Autostart. Be sure to also disable XScreenSaver in this same window. In Session Settings>Basic Settings>LXQt Modules, uncheck Power Management (this ensures Power Management notifications do not pop up).
An alternative is to create a kiosk.desktop file in `/home/<yourusername>/.config/autostart/` and add the following to the file:

```text
[Desktop Entry]
Exec=/home/<yourusername>/kiosk.sh
Name=kiosk
OnlyShowIn=LXQt;
Type=Application
Version=1.0
```

9\. Reboot

OPTIONAL: Browse pictures using SAMBA

1\. Install Samba

`sudo dnf install samba samba-common -y`

2\. Make backup of original

`sudo cp /etc/samba/smb.conf /etc/samba/smb.bk`

3\. Edit original file, remove all and add the following

```text
[global]
map to guest = Bad User
log file = /var/log/samba/%m
log level = 1
server role = standalone server

[guest]

# This share allows anonymous (guest) access
# without authentication!

path = /pics
read only = no
guest ok = yes
guest only = yes
```

4\. Enable and start the service

`sudo systemctl enable --now smb.service`

This is the outcome in my Fedora 41 LXQt test virtual machine with the slideshow delay set at 5 seonds.

{{< video src="/video/fed_kiosk_vm.mp4" width="70%" type="video/mp4" preload="auto" >}}

I also created a bash shell script for Fedora in the event I need to repeat the process on physical hardware.

```bash
#!/bin/bash
# Script to setup Fedora LXQt as a photo kiosk
# Requirements: Run as user on Fedora LXQt, feh, lightdm-gtk-greeter-settings and lidghtdm-gtk
# This script will install lightdm-gtk-greeter-settings and lidghtdm-gtk
#
#
# Disable SELINUX
echo "^^^ Disable selinux? yes or no: ^^^"
read -r SELINUXCHANGE
echo
if [ "$SELINUXCHANGE" == "yes" ]; then
 echo
sudo sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
sleep 3
else [ "$SELINUXCHANGE" == "no" ]
echo
read -r "**** Not changing. Hit [Enter] to continue ****"
fi
#
# Disable Firewall
echo "^^^ Disable firewall? yes or no: ^^^"
read -r FIREWALLCHANGE
echo
if [ "$FIREWALLCHANGE" == "yes" ]; then
echo
sudo systemctl disable firewalld
sleep 7
else [ "$FIREWALLCHANGE" == "no" ]
echo
read -r "**** Not changing. Hit [Enter] to continue ****"
fi
#
# Make your custom picture directory
sudo mkdir /pics
sudo chmod 777 -R /pics
#
# Create shell script for running feh
cat <<EOF >> "$HOME/kiosk.sh"
#!/bin/bash
cd /pics
feh -ZF -z -D 300 --hide-pointer
EOF
chmod 775 "$HOME/kiosk.sh"
# Install feh
sudo dnf install feh -y
# Disable sddm
sudo systemctl disable sddm.service
# Install lightdm packages
sudo dnf install lightdm-gtk lightdm-gtk-greeter-settings -y
# Enable lightdm
sudo systemctl enable lightdm.service
# Update lightdm conf
sudo sed -i 's|#xserver-command=X|xserver-command=X -s 0 -dpms|g' /etc/lightdm/lightdm.conf
echo
echo "^^^ Please enter your username: "
read -r NEWUSER
sudo sed -i "s|#autologin-user=|autologin-user=${NEWUSER}|g" /etc/lightdm/lightdm.conf
sudo sed -i 's|#autologin-user-timeout=0|autologin-user-timeout=0|g' /etc/lightdm/lightdm.conf
#
echo
echo "Add kiosk.sh shell script to Preferences>Session Settings>Autostart>LxQt Autostart. Also disable XScreenSaver in this same window."
echo
echo "DON'T FORGET TO ADD YOUR PICTURES TO /pics directory"
echo
sleep 2
# A choice to reboot or not
echo "^^^ Would you like to reboot? yes or no: ^^^"
read -r REBOOTRESPONSE
echo
if [ "$REBOOTRESPONSE" == "yes" ]; then
echo
echo "**** Rebooting ****"
echo "NOTE: Two reboots may be required for autologin"
sleep 4
sudo shutdown -r now
else [ "$REBOOTRESPONSE" == "no" ]
echo
read -p "**** Done with configuration of system. Hit [Enter] to continue ****"
echo "NOTE: Two reboots may be required for autologin"
sleep 2
fi
echo
exit
```

If you have any questions or comments, please feel free to send me an email noted in my About page.
