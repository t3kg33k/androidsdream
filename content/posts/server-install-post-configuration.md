+++
title = "Server Install Post-Configuration"
date = 2024-03-20T08:15:45-04:00
draft = false
tags = ["Linux","Shell script","Red Hat","AlmaLinux"]
+++
![Terminal script](/images/terminal-script.png)
As mentioned in [last post](https://www.androidsdream.net/posts/virtual-machine-automated-install/) when I complete a server install of either Red Hat or AlmaLinux, I have a post install shell script that completes some configuration setups. Hopefully someday I will get to writing an Ansible playbook to complete the same steps instead of using the shell script. I already have an Ansible playbook that configures my Fedora desktop and laptop when I complete a fresh install (I'll share in a later post) so it's just a matter of completing some of the same steps in the server Ansible playbook.

Below is the script I had used for my AlmaLinux server. Note that there are some items in this script that could potentially be included in the Kickstart file I posted in the last post, like setup a user and installing some utilities. Keep in mind in the below examples that the shell script is normally launched by the root user:

```bash
#!/bin/bash
# script to complete a post-install auto setup

echo
nmtui
echo
sleep 3
# Change the system's hostname
echo "^^^ The current hostname is -> `hostname` <-. Would you like to change the machine hostname? yes or no: ^^^"
read HOSTCHANGE
echo
if [ "$HOSTCHANGE" == "yes" ]; then
	echo
	echo "**** Changing the hostname. What would you like to change it to? ****"
	read HOSTNAME
	sudo hostnamectl set-hostname $HOSTNAME
	echo
	hostnamectl status
	sleep 7
fi
echo
# Setup new user
echo "^^^ Would you like to setup a new user? yes or no: "
read NEWUSERADD
if [ "$NEWUSERADD" == "yes" ]; then
	echo
	echo -n "Enter a username: "
	read NAME
	useradd -m $NAME
	passwd $NAME
else [ "$NEWUSERADD" == "no" ]
	echo
	read -p "**** Not creating a user. Hit [Enter] to continue ****"
fi
# Add new user to wheel group
echo "^^^ Add new user to the wheel group? yes or no: "
read NEWUSERWHEEL
if [ "$NEWUSERWHEEL" == "yes" ]; then
	echo
	usermod -aG wheel $NAME
else [ "$NEWUSERWHEEL" == "no" ]
	echo
	read -p "**** Not adding to wheel group. Hit [Enter} to continue ****"
fi
# Disable selinux?
echo "^^^ Disable selinux? yes or no: ^^^" 
read SELINUXCHANGE
echo
if [ "$SELINUXCHANGE" == "yes" ]; then
	echo
	sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
	sleep 3
else [ "$SELINUXCHANGE" == "no" ]
	echo
	read -p "**** Not changing. Hit [Enter] to continue ****"
fi
echo
# Disable firewall?
echo "^^^ Disable firewall? yes or no: ^^^" 
read FIREWALLCHANGE
echo
if [ "$FIREWALLCHANGE" == "yes" ]; then
	echo
	systemctl disable firewalld
	sleep 7
else [ "$FIREWALLCHANGE" == "no" ]
	echo
	read -p "**** Not changing. Hit [Enter] to continue ****"
fi

echo
echo "---- Proceeding with setup ----"
echo
echo "** Installing prefered applications **"
# Install EPEL repo
sudo dnf install epel-release -y
# Install preferred utilites
sudo dnf install vim bash-completion htop mlocate wget nfs-utils traceroute whois policycoreutils* bind-utils -y
echo
# Completes system and OS updates
echo
echo "^^^ Would you like to complete OS updates? yes or no: ^^^"
read UPDATESRESPONSE
echo
if [ "$UPDATESRESPONSE" == "yes" ]; then
	echo
	echo "**** Completing OS updates ****"
	echo
	sleep 3
	sudo dnf update -y
else [ "$UPDATESRESPONSE" == "no" ]
	echo
fi
sleep 3
echo
# A choice to reboot or not
echo "^^^ Would you like to reboot? yes or no: ^^^"
read REBOOTRESPONSE
echo
if [ "$REBOOTRESPONSE" == "yes" ]; then
        echo
        echo "**** Rebooting ****"
        sleep 3
        sudo shutdown -r now
else [ "$REBOOTRESPONSE" == "no" ]
		echo
		read -p "**** Done with configuration of system. Hit [Enter] to continue ****"
fi
echo
exit
```

The below shell script is what I now use for my Red Hat servers. Note now that there are some sections I have commented out because I include it in the Kickstart file (see last post) that will configure certain task and install programs during server install:

```bash
#!/bin/bash
# script to complete a post-install auto setup
echo
echo
# Change network
echo "^^^ Would you like to change the network? yes or no: ^^^"
read IPCHANGE
if [ "$IPCHANGE" == "yes" ]; then
	echo
	nmtui
else [ "$IPCHANGE" == "no" ]
	echo
	read -p "**** Not changing the network. Hit [Enter} to continue ****"
fi
echo
echo
# Change the system's hostname
echo "^^^ The current hostname is -> `hostname` <-. Would you like to change the machine hostname? yes or no: ^^^"
read HOSTCHANGE
echo
if [ "$HOSTCHANGE" == "yes" ]; then
	echo
	echo "**** Changing the hostname. What would you like to change it to? ****"
	read HOSTNAME
	hostnamectl set-hostname $HOSTNAME
	echo
	hostnamectl status
	sleep 7
fi
echo
echo
# The following user creation section is omitted
# due to being included in Kickstart - 03/12/24
# ***************************************************
#grep -w ed /etc/passwd
#echo
#sleep 2
# Setup new user
#echo "^^^ Would you like to setup a new user? yes or no: "
#read -r NEWUSERADD
#if [ "$NEWUSERADD" == "yes" ]; then
#    echo
#    echo -n "Enter a username: "
#    read -r NAME
#    useradd -m "$NAME"
#    passwd "$NAME"

    # Add new user to wheel group
#    echo "^^^ Add new user to the wheel group? yes or no: "
#    read -r NEWUSERWHEEL
#    if [ "$NEWUSERWHEEL" == "yes" ]; then
#        echo
#        usermod -aG wheel "$NAME"
#        echo
#    else [ "$NEWUSERWHEEL" == "no" ]
#        echo
#        echo "**** Not adding to wheel group. Hit [Enter} to continue ****"
#        echo
#    fi
#else [ "$NEWUSERADD" == "no" ]
#    echo
#    echo  "**** Not creating a user. Hit [Enter] to continue ****"
#    echo
#fi
echo
# UPDATE: The following will be disabled since I have this in my Kickstart - 03/12/24
# **************************************************
# Disable selinux? 
#echo "^^^ Disable selinux? yes or no: ^^^"
#read SELINUXCHANGE
#echo
#if [ "$SELINUXCHANGE" == "yes" ]; then
#	echo
#	sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
#	sleep 3
#else [ "$SELINUXCHANGE" == "no" ]
#	echo
#	read -p "**** Not changing. Hit [Enter] to continue ****"
#fi
echo
# UPDATE: The following will disabled since I have this in my Kickstart - 03/12/24
#echo "^^^ Disable firewall? yes or no: ^^^"
#read FIREWALLCHANGE
#echo
#if [ "$FIREWALLCHANGE" == "yes" ]; then
#	echo
#	systemctl disable firewalld
#	sleep 7
#else [ "$FIREWALLCHANGE" == "no" ]
#	echo
#	read -p "**** Not changing. Hit [Enter] to continue ****"
#fi

subscription-manager register --username <my username> --password <my password>
echo
echo
echo "** Installing prefered applications **"
echo
subscription-manager repos --enable codeready-builder-for-rhel-8-$(arch)-rpms
dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm -y
dnf install vim bash-completion htop mlocate nfs-utils traceroute whois policycoreutils* bind-utils -y
echo
# Completes system and OS updates
echo
echo "^^^ Would you like to complete OS updates? yes or no: ^^^"
read UPDATESRESPONSE
echo
if [ "$UPDATESRESPONSE" == "yes" ]; then
	echo
	echo "**** Completing OS updates ****"
	echo
	sleep 3
	dnf update -y
else [ "$UPDATESRESPONSE" == "no" ]
	echo
fi
sleep 3
echo
# A choice to reboot or not
echo "^^^ Would you like to reboot? yes or no: ^^^"
read REBOOTRESPONSE
echo
if [ "$REBOOTRESPONSE" == "yes" ]; then
        echo
        echo "**** Rebooting ****"
        sleep 3
        shutdown -r now
else [ "$REBOOTRESPONSE" == "no" ]
		echo
		read -p "**** Done with configuration of system. Hit [Enter] to continue ****"
fi
echo
exit
```

If you have questions or comments you can reach me via email on my [Linktree page](https://linktr.ee/edward_c).
