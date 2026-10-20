@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias...
  call npm install
)
if not exist node_modules\react-native-web (
  echo Instalando soporte web...
  call npx expo install react-dom react-native-web @expo/metro-runtime
)
if not exist node_modules\react-native-svg (
  echo Instalando react-native-svg...
  call npx expo install react-native-svg
)
call npx expo start --web
pause
