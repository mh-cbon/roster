:: use call so if a program fails, the bat continues to run
:: dld node with wget
call C:\vagrant\vagrant\wget.exe https://nodejs.org/dist/v6.1.0/node-v6.1.0-x64.msi --no-check-certificate -O C:\node-v6.1.0-x64.msi
:: silent install node
call msiexec.exe /i C:\node-v6.1.0-x64.msi INSTALLDIR="C:\nodejsx64" /quiet
:: a small check
call C:\nodejsx64\node.exe -v
:: install mocha
call C:\nodejsx64\npm.cmd i mocha -g
:: move to the working directory
cd C:\vagrant\
rmdir node_modules /s /q
:: install the package dependencies
call C:\nodejsx64\npm.cmd i
