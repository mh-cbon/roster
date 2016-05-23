# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  # on fedora-like, you must use the downloadable package of vagrant
  # available on hashi corp website.
  # The per distrib provided package wont provide winrm support..
  # see https://www.vagrantup.com/downloads.html

  config.vm.define :win2012 do |win|
    win.vm.box = "opentable/win-2012r2-standard-amd64-nocm"
    # big timeout since windows boot is very slow
    win.vm.boot_timeout = 500
    win.vm.communicator = :winrm
    win.vm.provider "virtualbox" do |vb|
      # first setup requires gui to be enabled so scripts can be executed in virtualbox guest screen
      vb.gui = true
      vb.gui = false
      vb.customize ["modifyvm", :id, "--memory", "1524"]
      vb.customize ["modifyvm", :id, "--vram", "128"]
      vb.customize ["modifyvm", :id,  "--cpus", "1"]
      vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
      vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
      vb.customize ["guestproperty", "set", :id, "/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold", 10000]
    end
  end

  config.vm.define "fedora" do |fedora|
    fedora.vm.box = "fedora/23-cloud-base"
    fedora.vbguest.auto_update = false
    fedora.vbguest.no_install = true
  end

  config.vm.define "centos6" do |centos6|
    centos6.vm.box = "geerlingguy/centos6"
  end

  config.vm.define "centos5" do |centos5|
    centos5.vm.box = "some/centos5"
    centos5.vm.box_url = "http://dl.dropbox.com/u/9227672/centos-5.6-x86_64-netinstall-4.1.6.box"
  end

  config.vm.define "centos56" do |centos56|
    centos56.vm.box = "some2/centos56"
    centos56.vm.box_url = "https://dl.dropbox.com/u/7196/vagrant/CentOS-56-x64-packages-puppet-2.6.10-chef-0.10.6.box"
  end

  config.vm.define "centos59" do |centos59|
    centos59.vm.box = "some/centos59"
    centos59.vm.box_url = "http://puppet-vagrant-boxes.puppetlabs.com/centos-59-x64-vbox4210.box"
  end

  config.vm.define "centos511" do |centos59|
    centos59.vm.box = "puppetlabs/centos-5.11-64-nocm"
  end

  config.vm.define "rh65" do |rh65|
    rh65.vm.box = "anandbitra/redhat-6.5"
  end


  config.vm.define :yosemite do |yosemite|
    yosemite.vm.box = "AndrewDryga/vagrant-box-osx"
    yosemite.vm.synced_folder ".", "/Users/vagrant/wd", type: "rsync"
    yosemite.vm.network :private_network, ip: "10.1.1.10"
  end

  config.vm.define :maverick do |maverick|
    maverick.vm.box = "http://files.dryga.com/boxes/osx-mavericks-0.1.0.box"
    maverick.vm.synced_folder ".", "/Users/vagrant/wd", type: "rsync"
    maverick.vm.network :private_network, ip: "10.1.1.10"
    maverick.vm.provider "virtualbox" do |vb|
      # note that those options are required to let the system boot properly
      # Otherwise, it won t restart our services
      # thanks to https://gist.github.com/WayneBuckhanan/15de1bb8b3fb3bd4f7af
      # Last note, maybe, the gui window is not required.
      vb.gui = false
      vb.memory = "1512"
      # vb.customize ["modifyvm", :id, "--chipset", "ich9"]
      vb.customize ["setextradata", :id, "VBoxInternal2/EfiGopMode", "1"]
      # vb.customize ["modifyvm", :id, "--cpuidset", "00000001","000206a7","02100800","1fbae3bf","bfebfbff"] # get OSX to boot past "hfs ..." message
      vb.customize ["modifyvm", :id, "--cpuidset", "00000001","000306a9","00020800","80000201","178bfbff"] # boot past "Missing Bluetooth Controller Transport" error
      vb.customize ["setextradata", :id, "VBoxInternal/Devices/efi/0/Config/DmiSystemProduct", "MacBookPro11,3"]
      vb.customize ["setextradata", :id, "VBoxInternal/Devices/efi/0/Config/DmiSystemVersion", "1.0"]
      vb.customize ["setextradata", :id, "VBoxInternal/Devices/efi/0/Config/DmiBoardProduct", "Iloveapple"]
      vb.customize ["setextradata", :id, "VBoxInternal/Devices/smc/0/Config/DeviceKey", "ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc"]
      vb.customize ["setextradata", :id, "VBoxInternal/Devices/smc/0/Config/GetKeyFromRealSMC", "1"]
    end
  end

  config.vm.define "ubuntu" do |ubuntu|
    ubuntu.vm.box = "ubuntu/trusty64"
    ubuntu.vm.hostname = "ubuntu.vagrant.dev"
    ubuntu.vm.network "private_network", type: :dhcp
  end

end
