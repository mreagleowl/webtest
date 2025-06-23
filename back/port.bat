@echo off
set PORT=8008
set RULE_NAME=Open_Port_%PORT%

echo Открытие TCP-порта %PORT% в брандмауэре Windows...

netsh advfirewall firewall add rule name="%RULE_NAME%" dir=in action=allow protocol=TCP localport=%PORT%
echo Порт %PORT% успешно открыт (TCP).

pause
