+++
title = "KVM Virtual Machine Template"
date = 2025-03-20T11:00:00-04:00
draft = false
tags = ["Linux","Virtualization","Shell script","AlmaLinux","Red Hat"]
+++
![kvm](/images/KVM-logo.png)

In a [previous post](https://www.androidsdream.net/posts/virtual-machine-automated-install/) I discussed creating a RHEL or AlmaLinux KVM virtual machine using a Kickstart file and a bash shell script. I've recently decided that I wanted an easier approach to quickly creating a virtual machine using a pre-existing template I had created. In my research, I found there are quite a few ways to complete this task but this is the method that works for me, using AlmaLinux, and may also work for you.

First, I created a virtual machine and designated it as a template. In my setup, I have secondary storage on my KVM server for this template .qcow2 file.

![Local Install](/images/KVM_Alma_templ_01.png)
![AlmaLinux iso](/images/KVM_Alma_templ_02.png)
![VM memory](/images/KVM_Alma_templ_03.png)
![VM file](/images/KVM_Alma_templ_04.png)
![VM storage](/images/KVM_Alma_templ_05.png)
![VM all](/images/KVM_Alma_templ_06.png)

Note that this template has a base storage size of 40GB, which in most cases is more than enough space. If an operating system with more space is required, a different template will need to be created.

Once the installation begins, I select the most basic operating system options while also creating a local user account with administrator privileges.

![VM OS](/images/KVM_Alma_templ_07.png)

Then, once the operating system installation is complete, I shut down the template virtual machine, making sure in boot options that it does not start when the host boots up.

To create a new virtual machine, I run this custom bash shell script on the virtual host.

```bash
#!/bin/bash
#
# This script can be used to create a new AlmaLinux KVM VM from existing templ and .qcow2 file
echo
echo ">> What is the name of the new virtual machine? "
read -r VMNAME
cd /vol2/vms2 || exit
cp almalinux9_templ.qcow2 /home/vms/"$VMNAME".qcow2
# Create the VM via import of existing .qcow2 copied above
virt-install --name "$VMNAME" --memory 4096 --vcpus 2 --disk /home/vms/"$VMNAME".qcow2 --import --os-variant almalinux9 --wait 1
```

The very basic virt-install command in the above script is thus:

```text
virt-install --name almatest --memory 4096 --vcpus 2 --disk /home/vms/almatest.qcow2 --import --os-variant almalinux9 --wait 1
```

The above virt-install options meaning:

```text
almatest                 = name of new VM
4096                     = virtual memory allocation
2                        = number of virtual CPUs
/home/vms/almatest.qcow2 = new copied .qcow2 file from template
almalinux9               = Version of operating system
1                        = the number of minutes to wait for the new VM to be created before exiting the import
```

One thing I noticed is that if you attempt to create a new virtual machine using the same name it will halt and display this output (which is great):

```text
ERROR    Disk /home/vms/almatest.qcow2 is already in use by other guests ['almatest']. (Use --check path_in_use=off or --check all=off to override)
```

When the new virtual machine is created using the template and script, I power it up, and continue with the normal post-provision configurations (hostname, network, etc).

All virt-install command documentation can be found [here (where I found my example)](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/virtualization_deployment_and_administration_guide/sect-guest_virtual_machine_installation_overview-creating_guests_with_virt_install#sect-Guest_virtual_machine_import) and [here](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/configuring_and_managing_virtualization/getting-started-with-virtualization-in-rhel-8_configuring-and-managing-virtualization#creating-virtual-machines-using-the-command-line-interface_assembly_creating-virtual-machines).

If you have any questions or comments, please feel free to send me an email noted in my About page.
