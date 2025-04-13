+++
title = "Minisforum NAB5 New VM Host"
date = 2024-04-15T05:06:00-04:00
draft = false
tags = ["Homelab","Linux","Hardware","Virtualization"]
+++
I found such a good deal on a new computer a few weeks ago that I had to pull the trigger. I had been shopping for an inexpensive mini-PC that I could setup as a new KVM/libvirt virtual machine host to replace my Intel NUC and found the Minisforum Venus Series NAB5 on Newegg on sale for 359 dollars USD. Normally, I purchase used computers on Ebay, most of the time for under 200 dollars USD; the two Lenovo ThinkCentre M700 you see in the diagram below I purchased for less than 100 dollars USD (my leon machine had some roles at one time but have been migrated to other servers). My Intel NUC is just getting too old and doesn't have the required resources I need for virtual machines, that was the main reason I purchased something new that had more resources.

These are the specs of the Minisforum NAB5:

![Minisforum NAB5](/images/Minisforum_NAB5_specs.png)

For now, the Intel NUC will just serve as a "test environment" while the NAB5 will be my "production environment".

If you are curious on how I moved the virtual machines from the NUC to the NAB5, it was just simply a matter of shutting down the virtual machine on the NUC and copying over the "virtualmachine".qcow2 file to the new directory on the new host and /etc/libvirt/qemu/"virtualmachine".xml over to the same directory on the new host. The other thing that was required was making sure the .xml file had the correct path to where the "virtualmachine".qcow2 exists on the new machine. For me, I created a path in /home/vms on the NAB5. The .xml will look something like this:

```text
<disk type='file' device='disk'>
      <driver name='qemu' type='qcow2'/>
      <source file='/home/vms/pris.qcow2'/>
      <target dev='vda' bus='virtio'/>
      <address type='pci' domain='0x0000' bus='0x04' slot='0x00' function='0x0'/>
</disk>
```

Once the necessary files are copied over to the new host and configuration adjustments made, you will need to restart the service on the new host with: *systemctl restart libvirtd*
Also, I learned the hard way, that you have to make sure to tick that box in Virtual Machine Manager on the new host to Autostart if the host reboots or shuts down for any reason.

![Virtual Manager](/images/vm_autostart.png)

And one final item I had to change was my VM backup shell script on the NUC and NAB5. Here is that script that I put in my crontab for root to run once a month on the NAB5:

```bash
#!/bin/bash
# Script to backup the virtual machines
#
# 1. ----------------------------------
# -- Backup blackhole pihole backup
# Shutdown the virtual machine
virsh shutdown blackhole
# Pause for 30 seconds on the script while shutdown
sleep 30s
# Backup the config xml to external storage
virsh dumpxml blackhole > /mnt/usb/blackhole_backup.xml
# Copy the virtual disk to external storage
cp /home/vms/blackhole.qcow2 /mnt/usb/
# Start the virtual machine
virsh start blackhole
# Change to the external storage
cd /mnt/usb
# Compress the virtual drive and config
tar cvzf blackhole_backup_$(date +%Y%m%d_%H%M%S).tar.gz blackhole.qcow2 blackhole_backup.xml
# Remove the files that were compressed to save space
rm -f /mnt/usb/blackhole.qcow2 /mnt/usb/blackhole_backup.xml
#
# 2. ----------------------------------
# -- Backup Home Assistant
# Shutdown the virtual machine
virsh shutdown hass
# Pause for 30 seconds on the script while shutdown
sleep 30s
# Backup the config xml to external storage
virsh dumpxml hass > /mnt/usb/hass_backup.xml
# Copy the virtual disk to external storage
cp /home/vms/haos_ova-9.0.qcow2 /mnt/usb/
# Start the virtual machine
virsh start hass
# Change to the external storage
cd /mnt/usb
# Compress the virtual drive and config
tar cvzf hass_backup_$(date +%Y%m%d_%H%M%S).tar.gz haos_ova-9.0.qcow2 hass_backup.xml
# Remove the files that were compressed to save space
rm -f /mnt/usb/haos_ova-9.0.qcow2 /mnt/usb/hass_backup.xml
#
# 3. ----------------------------------
# -- Backup Androids Dream web server
# Shutdown the virtual machine
virsh shutdown pris
# Pause for 30 seconds on the script while shutdown
sleep 30s
# Backup the config xml to external storage
virsh dumpxml pris > /mnt/usb/pris_backup.xml
# Copy the virtual disk to external storage
cp /home/vms/pris.qcow2 /mnt/usb/
# Start the virtual machine
virsh start pris
# Change to the external storage
cd /mnt/usb
# Compress the virtual drive and config
tar cvzf pris_backup_$(date +%Y%m%d_%H%M%S).tar.gz pris.qcow2 pris_backup.xml
# Remove the files that were compressed to save space
rm -f /mnt/usb/pris.qcow2 /mnt/usb/pris_backup.xml
#
# 4. ----------------------------------
# -- Backup Caddy proxy server
# Shutdown the virtual machine
virsh shutdown proxy
# Pause for 30 seconds on the script while shutdown
sleep 30s
# Backup the config xml to external storage
virsh dumpxml proxy > /mnt/usb/proxy_backup.xml
# Copy the virtual disk to external storage
cp /home/vms/proxy.qcow2 /mnt/usb/
# Start the virtual machine
virsh start proxy
# Change to the external storage
cd /mnt/usb
# Compress the virtual drive and config
tar cvzf proxy_backup_$(date +%Y%m%d_%H%M%S).tar.gz proxy.qcow2 proxy_backup.xml
# Remove the files that were compressed to save space
rm -f /mnt/usb/proxy.qcow2 /mnt/usb/proxy_backup.xml
#

```

Here is the updated diagram (using Draw.io in my Nextcloud instance now; trying to move away from Microsoft Visio). As I stated [before in my previous post](https://www.androidsdream.net/posts/home-network/), my network is very dynamic.

![Diagram](/images/home_network_generic.png)
