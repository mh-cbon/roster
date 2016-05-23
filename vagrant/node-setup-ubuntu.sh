
NODE_URL=https://nodejs.org/dist/v6.1.0/node-v6.1.0-linux-x64.tar.xz
NODE_TAR=/home/vagrant/node/node-v6.1.0-linux-x64.tar.xz
NODE_BIN_PATH=/home/vagrant/node/node-v6.1.0-linux-x64/bin

if [ ! -f $NODE_TAR ]; then
  mkdir -p /home/vagrant/node
  cd /home/vagrant/node/
  wget $NODE_URL
  tar -xvf $NODE_TAR
  $NODE_BIN_PATH/node $NODE_BIN_PATH/npm i mocha -g
fi
