
NODE_URL=https://nodejs.org/dist/v6.1.0/node-v6.1.0-darwin-x64.tar.gz
NODE_TAR=/Users/vagrant/node/node-v6.1.0-darwin-x64.tar.xz
NODE_BIN_PATH=/Users/vagrant/node/node-v6.1.0-darwin-x64/bin

if [ ! -f $NODE_TAR ]; then
  mkdir -p /Users/vagrant/node
  cd /Users/vagrant/node/
  curl "$NODE_URL" -o "$NODE_TAR"
  tar -xvf $NODE_TAR
  $NODE_BIN_PATH/node $NODE_BIN_PATH/npm i mocha -g
fi
cd /Users/vagrant/wd
$NODE_BIN_PATH/node $NODE_BIN_PATH/npm i
