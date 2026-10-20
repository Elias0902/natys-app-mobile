@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias...
  call npm install
)
if not exist node_modules\react-native-svg (
  echo Instalando react-native-svg...
  call npx expo install react-native-svg
)
call npx expo start
pause
