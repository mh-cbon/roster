:: run mocha
cd C:\vagrant\
set DEBUG=@mh-cbon/nsi
call C:\Users\vagrant\AppData\Roaming\npm\mocha.cmd test\sapi-fails.js
call C:\Users\vagrant\AppData\Roaming\npm\mocha.cmd test\remove.js
call C:\Users\vagrant\AppData\Roaming\npm\mocha.cmd test\validate.js
