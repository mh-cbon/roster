NODE_BIN_PATH=/home/vagrant/node/node-v6.1.0-linux-x64/bin

cd /vagrant/

rm -fr node_modules/
$NODE_BIN_PATH/node $NODE_BIN_PATH/npm i

DEBUG=@mh-cbon/nsi SYSINIT=chkconfig $NODE_BIN_PATH/node $NODE_BIN_PATH/mocha test/initial.js
