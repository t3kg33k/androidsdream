+++
title = "New PC Build"
date = 2024-05-23T05:30:00-04:00
draft = false
tags = ["Hardware","Ansible"]
+++
Finally, after using the same PC build for 9 years, I have built a new desktop PC. Thanks to the community members over at Tom's Hardware forum, I puchased the parts from this list (as of 05/2024): <https://pcpartpicker.com/user/t3kg33k_og/saved/#view=zpXWrH>

Even though I am an avid Linux fan, I had no choice but to install Windows 11 because there is one game that I play regulary (when I have the time), and have played for a very long time, that will not work in Steam's ProtonDB is Insurgency: Sandstorm due to the anti-cheat software it uses is only compatible in Windows. For all my other games on Steam, and as my daily driver, I use Fedora Plasma in a dual-boot configuration.

![Fastfetch build](/images/fastfetch_capture_202405.png)

One of the many wonderful things about Linux, and Fedora specifically, is that you can install the operating system, have updates applied and applications installed in less than 30 minutes, maybe less. For me, one of the post-configuration options I use for that process is an Ansible playbook that installs all of my applications, completes updates and even some minor configurations. Once I install Fedora, I download all my scripts from my local Nextcloud repo, install Ansible (this is one minor gripe I have about Fedora is that they don't include the Ansible package in the base operating system), and then launch my Ansible playbook. Here is a version of my playbook, with edits for security:

```yaml
---
 - hosts: localhost
   tasks:
###### The following imports repo keys for RPM Fusion
    - name: Importing RPM Fusion (free) key
      become: yes
      ansible.builtin.rpm_key:
        state: present
        key: https://rpmfusion.org/keys?action=AttachFile&do=get&target=RPM-GPG-KEY-rpmfusion-free-fedora-2020

    - name: Importing RPM (non-free) key
      become: yes
      ansible.builtin.rpm_key:
        state: present
        key: https://rpmfusion.org/keys?action=AttachFile&do=get&target=RPM-GPG-KEY-rpmfusion-nonfree-fedora-2020

###### The following installs the RPM Fusion repos
    - name: Remote RPM install for RPM Fusion nonfree repo
      become: yes
      dnf: 
        name: https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-{{ansible_distribution_major_version}}.noarch.rpm
        state: present
      when: ansible_distribution == 'Fedora'

    - name: Remote RPM install for RPM Fusion free repo
      become: yes
      dnf: 
        name: https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-{{ansible_distribution_major_version}}.noarch.rpm
        state: present
      when: ansible_distribution == 'Fedora'

###### The following adds the Brave Browser repo
    - name: Adding Brave browser repo
      become: yes
      ansible.builtin.command: dnf config-manager --add-repo https://brave-browser-rpm-release.s3.brave.com/x86_64/

    - name: Importing Brave browser key
      become: yes
      ansible.builtin.command: rpm --import https://brave-browser-rpm-release.s3.brave.com/brave-core.asc

##### Install OS updates
    - name: update OS
      become: yes
      dnf:
        name: '*'
        state: latest
        update_cache: yes
      when:
        - ansible_os_family == "RedHat"

##### Remove applications

    - name: Remove libswscale-free
      become: yes
      package:
        name: libswscale-free
        state: absent

    - name: Remove libswresample-free
      become: yes
      package:
        name: libswresample-free
        state: absent

    - name: Remove libavutil-free
      become: yes
      package:
        name: libavutil-free
        state: absent

##### Begin installing applications

    - name: Install Applications
      become: yes
      package:
        state: present
        name:
          - avidemux
          - brave-browser
          - ffmpeg
          - git
          - htop
          - hugo
          - kdenlive
          - lshw
          - ncdu
          - nextcloud-client
          - nmap
          - rclone
          - rapid-photo-downloader
          - smplayer
          - steam
          - tmux
          - tmate
          - vim
          - virt-manager

##### Add flathub repo
    - name: Add flathub repo
      become: no
      community.general.flatpak_remote:
        name: flathub
        state: present
        flatpakrepo_url: https://dl.flathub.org/repo/flathub.flatpakrepo
        method: user

##### Continue installing applications from flathub
    - name: Install MakeMKV
      become: no
      flatpak:
        name: com.makemkv.MakeMKV
        state: present 
        method: user

    - name: Install Handbrake
      become: no
      flatpak:
        name: fr.handbrake.ghb
        state: present
        method: user

    - name: Install Signal
      become: no
      flatpak:
        name: org.signal.Signal
        state: present
        method: user

    - name: Install Discord
      become: no
      flatpak: 
        name: com.discordapp.Discord
        state: present
        method: user

    - name: Install OnlyOffice 
      become: no
      flatpak:
        name: org.onlyoffice.desktopeditors
        state: present
        method: user

        ##### Set VIM as the default editor
    - name: Configure vim as default
      become: yes
      dnf:
        name: vim-default-editor
        state: present
        allowerasing: yes

##### Stop and disabled the firewall
    - name: Stop and disable firewalld
      become: yes
      service:
        name: firewalld
        state: stopped
        enabled: no

##### Create directories for NFS NAS shares
    - name: Create /mnt/nas_backup directory if it does not exist
      become: yes
      ansible.builtin.file:
        path: /mnt/nas_backup
        state: directory
        mode: '0777'

    - name: Create /mnt/nas_media directory if it does not exist
      become: yes
      ansible.builtin.file:
        path: /mnt/nas_media
        state: directory
        mode: '0777'

##### Add the NFS share mounts to fstab
    - name: Add to fstab nas_backup
      become: yes
      ansible.builtin.lineinfile:
        path: /etc/fstab
        line: 192.168.x.x:/volume1/backups /mnt/nas_backup nfs rsize=8192,wsize=8192,timeo=14,intr

    - name: Add to fstab nas_media
      become: yes
      ansible.builtin.lineinfile:
        path: /etc/fstab
        line: 192.168.x.x:/volume1/media /mnt/nas_media nfs rsize=8192,wsize=8192,timeo=14,intr

##### Replace .bashrc with custom .bashrc
    - name: Copy bashrc template
      ansible.builtin.copy:
         src: /home/ed/scripts_repo/configs/Fed/bashrc_Fed
         dest: /home/ed/.bashrc
         owner: ed
         group: ed
         mode: '0644'
         backup: yes

##### Replace .tmux.conf with custom .tmux.conf
    - name: Copy tmux.conf template
      ansible.builtin.copy:
         src: /home/ed/scripts_repo/configs/Fed/tmux.conf
         dest: /home/ed/.tmux.conf
         owner: ed
         group: ed
         mode: '0644'
         backup: yes

##### Create .vimrc with custom .vimrc
    - name: Copy vimrc template
      ansible.builtin.copy:
         src: /home/ed/scripts_repo/configs/Fed/vimrc
         dest: /home/ed/.vimrc
         owner: ed
         group: ed
         mode: '0644'
         backup: yes

##### Create a bin directory for launching scripts
    - name: Create home bin directory if it does not exist
      ansible.builtin.file:
         path: /home/ed/bin
         state: directory
         mode: '0755'

##### Add line to sudoers
    - name: Add last line to sudoers
      become: yes
      ansible.builtin.lineinfile:
        path: /etc/sudoers
        line: "ed  ALL=(ALL) NOPASSWD: /usr/bin/dnf, /usr/bin/flatpak" 

```

One thing I've discovered after this most recent build is that I actually need to add some other items to this list of repos and applications. Examples being applications like Rustdesk client that I use to connect to clients on my Tailscale network, ProtonVPN, Visual Studio Code (because of taking Python classes at school, I have found this application to be quite useful and powerful for all my scripting), other minor applications, and additional configurations like adding my local account to the libvirt group. That's the beauty of Ansible is that it is a very powerful tool. Not only is it used for Linux configuration, but it can be used in Windows and on some networking operating systems. Ansible uses ssh to connect to nodes for configuration, so as long as you have a connection you can configure it. I even have a very minor playbook I use to update my Red Hat servers on my LAN. I have it split into different host segments and different playbooks specific to host.

One for my test server:

```yaml
--- # Complete system updates
- hosts: test
  become: true
  become_user: root
  become_method: su
  tasks:

  - name: update dnf packages
    dnf: 
      name: '*'
      state: latest
      update_cache: yes
    when:
      - ansible_os_family == "RedHat"

  - name: Reboot the servers with delay
    ansible.builtin.reboot:
      pre_reboot_delay: 65
      reboot_timeout: 120
```

One for my virtual servers:

```yaml
--- # Complete system updates
- hosts: home_servers
  become: true
  become_user: root
  become_method: su
  tasks:

  - name: update dnf packages
    dnf: 
      name: '*'
      state: latest
      update_cache: yes
    when:
      - ansible_os_family == "RedHat"

  - name: Reboot the servers with delay
    ansible.builtin.reboot:
      pre_reboot_delay: 65
      reboot_timeout: 120
```

And one for my physical virtual host:

```yaml
--- # Complete system updates
- hosts: vhost
  become: true
  become_user: root
  become_method: su
  tasks:

  - name: update dnf packages
    dnf:
      name: '*'
      state: latest
      update_cache: yes
    when:
      - ansible_os_family == "RedHat"

  - name: Reboot the servers with delay
    ansible.builtin.reboot:
      pre_reboot_delay: 65
      reboot_timeout: 180
```

It's beautiful. One of these days I need to create an Ansible playbook for my server post-configuration also. As I have stated before in a [previous post](https://www.androidsdream.net/posts/server-install-post-configuration/), I use a shell script but that shell script can easily be replaced with an Ansible playbook. Truthfully, I am not an Ansible expert and I would love to learn more but I have time constraints currently with personal, work and school life.
For now, I'm going to go enjoy my new PC.
