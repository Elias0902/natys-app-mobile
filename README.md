# natys-app-mobile

Natys mobile app (React Native + Expo). Client for the **natys-larence** system: login, sign up, password reset, ecommerce with cart and the modules approved for mobile (Proveedores, Comercial, Finanzas, Notificaciones, Ayuda, Perfil).

## Run

```
npm install
npx expo start          # Expo Go (scan the QR)
npx expo start --web    # browser
```

On Windows you can also double-click `iniciar.bat` (or `iniciar-web.bat`).

## Backend

`src/config.js`:

- `USE_MOCK = true` runs the app on sample data (no backend needed).
- To use the real system set `USE_MOCK = false` and `BASE_URL` to your server (e.g. `http://192.168.1.50/natys-larence`).
- Copy `php/login_movil.php` and `php/lista_movil.php` into `natys-larence/api/`.

## Structure

```
App.js            navigation state, cart, layout
src/api.js        login / signup / reset / generic list calls (+ mock mode)
src/menu.js       sidebar structure (same as the web system)
src/screens/      Login, Ecommerce, Cart, Profile, List, Info
src/components/   Header, Drawer, UserMenu, LoginIllustration
php/              endpoints to add to natys-larence
```
