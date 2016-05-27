NODE_BIN_PATH=/Users/vagrant/node/node-v6.1.0-darwin-x64/bin

cd /Users/vagrant/wd/

rm -fr node_modules/
$NODE_BIN_PATH/node $NODE_BIN_PATH/npm i

DEBUG=@mh-cbon/roster,@mh-cbon/dscl-users $NODE_BIN_PATH/node $NODE_BIN_PATH/mocha test/
