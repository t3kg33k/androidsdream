+++
title = "Virtual Machine Automated Install"
date = 2024-03-13T08:15:45-04:00
draft = false
tags = ["Linux","Virtualization","Shell script","Kickstart"]
+++
![terminal](/images/terminal.png)
As you may have seen in my last post, I have a Red Hat virtual machine host running on an Intel NUC. This virtual host has a couple of functions for my virtual environment: To setup virtual machines for permanent services (e.g. proxy server, web server, Home Assistant, etc.) and to setup a virtual machine for temporary testing. It seems that more times than any others that I have use cases for setting up a temporary virtual machine for some testing. As you may have also seen in my previous post is that I prefer the Linux operating system. There was a time that I used CentOS, but then that changed to AlmaLinux (for reasons, if you know the history of CentOS). However, when I found out that one can sign up for a Red Hat Developer account (<https://developers.redhat.com/products/rhel/download>) that allows for 16 free RHEL subscriptions, that settled the move from AlmaLinux to Red Hat. I use and support Red Hat in my day job, so why not use it at home too, was my thought. Don't get me wrong about AlmaLinux. I love that operating system and consider it to be the best alternative to Red Hat.

There has always been a need for deploying a server really quickly. When I was using AlmaLinux as my primary server operating system, I found a shell script that would provision a machine automatically. I forgot where I found it and apologize for not giving credit to that person, but here it is with my own personal edits:

```bash
#!/bin/bash
#
# This script is used to deploy a VM on KVM host using virt-install and a Kickstart file.
# NOTE: For the current config, the Kickstart file should be in the home folder.
 
## Define variables
MEM_SIZE=2048       # Memory setting in MiB
VCPUS=2             # CPU Cores count
OS_VARIANT="almalinux8" # List with osinfo-query  os
ISO_FILE="/home/isos/AlmaLinux-8.4-x86_64-minimal.iso" # Path to ISO file

echo -en "Enter vm name: "
read VM_NAME
OS_TYPE="linux"
echo -en "Enter virtual disk size : "
read DISK_SIZE
 
sudo virt-install \
     --name ${VM_NAME} \
     --memory=${MEM_SIZE} \
     --vcpus=${VCPUS} \
     --os-type ${OS_TYPE} \
     --location ${ISO_FILE} \
     --disk path=/home/images/${VM_NAME}.qcow2,format=qcow2,bus=virtio,size=${DISK_SIZE}  \
     --network bridge=br0 \
     --graphics=none \
     --os-variant=${OS_VARIANT} \
     --console pty,target_type=serial \
     --initrd-inject Alma8-ks_VM.cfg --extra-args "inst.ks=file:/Alma8-ks_VM.cfg console=tty0 console=ttyS0,115200n8"
#     --extra-args="ks=http://<web_server_IP>/Alma8-ks_VM.cfg console=tty0 console=ttyS0,115200" --check all=off
```

Accompanying that script was the following Kickstart file:

```
#version=RHEL8
# Use text mode install
text

repo --name="Minimal" --baseurl=file:///run/install/sources/mount-0000-cdrom/Minimal

%packages
@^minimal-environment
@standard
kexec-tools
%end

# System language
lang en_US.UTF-8

# Network information
#network  --bootproto=dhcp --device=enp1s0 --noipv6 --activate --onboot=on
network --bootproto=static --device=enp1s0 --noipv6 --ip=192.168.x.x --netmask=255.255.255.0 --gateway=192.168.x.1 --nameserver=192.168.x.x

# Use CDROM installation media
cdrom

# Run the Setup Agent on first boot
firstboot --enable

# Do not configure the X Window System
skipx

ignoredisk --only-use=vda

# System bootloader configuration
bootloader --append="crashkernel=auto" --location=mbr --boot-drive=vda

autopart
# Partition clearing information
clearpart --all --initlabel --drives=vda

# System timezone
timezone America/New_York --isUtc

# Root password
rootpw --iscrypted <encrypted password goes here>

# Add user and user to wheel group
user --groups=wheel --name=ed --password=<encrypted password goes here> --iscrypted --gecos="ed"

%addon com_redhat_kdump --enable --reserve-mb='auto'

%end

%anaconda
pwpolicy root --minlen=6 --minquality=1 --notstrict --nochanges --notempty
pwpolicy user --minlen=6 --minquality=1 --notstrict --nochanges --emptyok
pwpolicy luks --minlen=6 --minquality=1 --notstrict --nochanges --notempty
%end

```

Since I started using Red Hat, here is a more current shell script I use to deploy my Red Hat virtual machines:

```bash
#!/bin/bash
 
## Define variables
MEM_SIZE=4096       # Memory setting in MiB
VCPUS=2             # CPU Cores count
OS_VARIANT="rhel8.8" # List with osinfo-query  os
ISO_FILE="/home/isos/rhel-8.8-x86_64-dvd.iso" # Path to ISO file

echo -en "Enter vm name: "
read VM_NAME
OS_TYPE="linux"
echo -en "Enter virtual disk size : "
read DISK_SIZE
 
sudo virt-install \
     --name ${VM_NAME} \
     --memory=${MEM_SIZE} \
     --vcpus=${VCPUS} \
     --os-type ${OS_TYPE} \
     --location ${ISO_FILE} \
     --disk path=/home/images/${VM_NAME}.qcow2,format=qcow2,bus=virtio,size=${DISK_SIZE}  \
     --network bridge=br0 \
     --graphics=none \
     --os-variant=${OS_VARIANT} \
     --console pty,target_type=serial \
     --initrd-inject rhel8-ks_VM.cfg --extra-args "inst.ks=file:/rhel8-ks_VM.cfg console=tty0 console=ttyS0,115200n8"
#     --extra-args="ks=http://<web_server_IP>/Alma8-ks_VM.cfg console=tty0 console=ttyS0,115200" --check all=off
```

And here is the Red Hat Kickstart file (a little different than the AlmaLinux version):

```
#version=RHEL8
# Use text mode install
text

#repo --name="Minimal" --baseurl=file:///run/install/sources/mount-0000-cdrom/Minimal
repo --name="AppStream" --baseurl=file:///run/install/sources/mount-0000-cdrom/AppStream

#repo --name="AppStream" --base=http://<web_server_IP>/rhel8dvd/AppStream
#repo --name="BaseOS" --base=http://<web_server_IP>/rhel8dvd/BaseOS

%packages
@^minimal-environment
@standard
kexec-tools
bash-completion
cockpit
vim*
wget

%end

# System language
lang en_US.UTF-8

# Network information
network  --bootproto=dhcp --device=enp1s0 --noipv6 --activate --onboot=on

# Use CDROM installation media
cdrom
# Testing per Red Hat Bugzilla – Bug 1920574
#harddrive --partition=vdb --dir=/
#url --url http://<web_server_IP>/rhel8dvd

# Run the Setup Agent on first boot
firstboot --disable
# Do not configure the X Window System
skipx

ignoredisk --only-use=vda
# System bootloader configuration
bootloader --append="crashkernel=auto" --location=mbr --boot-drive=vda
autopart
# Partition clearing information
clearpart --all --initlabel --drives=vda

# Intended system purpose
syspurpose --role="Red Hat Enterprise Linux Server" --sla="Self-Support" --usage="Development/Test"

# System timezone
timezone America/New_York --isUtc

# Disable SELinux
selinux --disabled

# Disable firewall
firewall --disabled

# Root password
rootpw --iscrypted <encrypted password goes here>

# Add user and user to wheel group
user --groups=wheel --name=ed --password=<encrypted password goes here> --iscrypted --gecos="ed"

shutdown

%addon com_redhat_kdump --enable --reserve-mb='auto'

%end

%anaconda
pwpolicy root --minlen=6 --minquality=1 --notstrict --nochanges --notempty
pwpolicy user --minlen=6 --minquality=1 --notstrict --nochanges --emptyok
pwpolicy luks --minlen=6 --minquality=1 --notstrict --nochanges --notempty
%end
```

Keep in mind in the above examples that the shell script is normally launched by the root user and the Kickstart file resides in the root user directory (/root). Also keep in mind (VERY IMPORTANT) that when you launch that shell script in your terminal it will present the KVM console of that new virtual machine. To exit you will need to select the keyboard shortcut of Ctrl+].

Next post I will explain how I complete quick post-provision configuration of that virtual machine.
