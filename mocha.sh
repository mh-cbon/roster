# set -e

vagrant up fedora
vagrant rsync fedora
vagrant ssh fedora -c "sh /vagrant/vagrant/node-setup-fedora.sh"
vagrant ssh fedora -c "sh /vagrant/vagrant/run-tests-fedora.sh"
vagrant halt fedora
exit

vagrant up maverick
vagrant rsync maverick
vagrant ssh maverick -c "sh /Users/vagrant/wd/vagrant/node-setup-mac.sh"
vagrant ssh maverick -c "sh /Users/vagrant/wd/vagrant/run-tests-mac.sh"
# vagrant halt maverick
exit

vagrant up ubuntu
vagrant ssh ubuntu -c "sh /vagrant/vagrant/node-setup-ubuntu.sh"
vagrant ssh ubuntu -c "sh /vagrant/vagrant/run-tests-linux.sh"
vagrant halt ubuntu

vagrant up fedora
vagrant rsync fedora
vagrant ssh fedora -c "sh /vagrant/vagrant/node-setup-fedora.sh"
vagrant ssh fedora -c "sh /vagrant/vagrant/run-tests-fedora.sh"
vagrant halt fedora

vagrant up centos6
vagrant ssh centos6 -c "sh /vagrant/vagrant/node-setup-centos.sh"
vagrant ssh centos6 -c "sh /vagrant/vagrant/run-tests-centos.sh"
vagrant halt centos6

vagrant up yosemite
vagrant ssh yosemite -c "sh /Users/vagrant/wd/vagrant/node-setup-mac.sh"
vagrant ssh yosemite -c "sh /Users/vagrant/wd/vagrant/run-tests-mac.sh"
vagrant halt yosemite

vagrant up win2012
vagrant winrm win2012 -c ". C:\\vagrant\\vagrant\\node-setup.bat | Write-Output"
vagrant winrm win2012 -c ". C:\\vagrant\\vagrant\\run-tests.bat | Write-Output"
vagrant halt win2012
