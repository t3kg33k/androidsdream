+++
title = "KVM Windows 11 Virtual Machine Fine Tuning"
date = 2025-10-16T08:30:00-04:00
draft = false
tags = ["Linux","Virtualization","Windows 11"]
+++
![kvm](/images/KVM-logo.png)
It is really unfortunate that I have to do this at a university that should be operating system and Office suite agnostic  (especially for a degree in Information Technology); I needed to setup a Windows 11 virtual machine just so that I could use the Microsoft 365 Office Suite for some classes now that [Microsoft is no longer supporting Windows 10](https://support.microsoft.com/en-us/windows/windows-10-support-has-ended-on-october-14-2025-2ca8b313-1946-43d3-b55c-2b95b107f281). Some of you, as you read this, are probably saying "Just use LibreOffice". And I do; I use it frequently when I can. But, if you have used LibreOffice enough you know that sometimes the translations to Microsoft Office format does not always populate correctly.

Installing and setting up Windows 11 guest was not an issue, even though it took forever.
*Side note: It still shocks me to this day how much time it takes to install and configure Windows compared to any and all Linux distributions. Where Windows 11 install and configure (this includes updating the operating system) can take hours, I can have Fedora installed and configured in less than an hour.

The issue that I discovered after the install was how slow and bogged down the Windows 11 virtual machine seemed compared to the Linux virtual machines I seamlessly run without issue despite giving the guest plenty of memory and CPU. Then I remembered that the Windows Sys Admins at work had a similar issue when they setup Windows 2019 Server guest on the RHEL KVM host server that I support. I found then that virtio drivers needed to be installed on the guest, which I had done on the Windows 11 guest. But that didn't seem to matter. Then I remembered that some parameters needed to be set within the qemu .xml file of the guest on the host. The parameter is this:

```xml
  <hyperv>
    <relaxed state='on'/>
    <vapic state='on'/>
    <spinlocks state='on' retries='8191'/>
    <vendor_id state='on' value='KVM Hv'/>
    <vpindex state='on'/>
    <runtime state='on' />
    <synic state='on'/>
    <stimer state='on'>
      <direct state='on'/>
    </stimer>
    <frequencies state='on'/>
    <reset state='on'/>
    <tlbflush state='on'/>
    <reenlightenment state='on'/>
    <ipi state='on'/>
    <evmcs state='on'/>
  </hyperv>
```

Once the virtual machine was powered down I added this section, powered it back up and immediately noticed the improvement in performance, both on the guest and the host.
All details can be found in this Red Hat document [here](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/configuring_and_managing_windows_virtual_machines/optimizing-windows-virtual-machines).

If you have any questions or comments, please feel free to send me an email noted in my About page.
