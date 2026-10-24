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
- Copy `php/login_movil.php`, `php/lista_movil.php` and `php/crud_movil.php` into `natys-larence/api/` (check the action names in `crud_movil.php`).

## Structure

```
App.js            navigation state, cart, layout (sidebar on desktop, drawer on phones)
src/api.js        login / signup / reset / generic list calls (+ mock mode)
src/menu.js       sidebar structure (same as the web system)
src/layout.js     breakpoints (phone < 768 < tablet < 1024 < desktop) and max content width
src/screens/      Login, Ecommerce, Cart, Profile, List, Info
src/components/   Header, Sidebar, Drawer, MenuList, Page (screen + title), Icon,
                  RecordTable / RecordRow (desktop), RecordCard (phone), Pagination...
php/              endpoints to add to natys-larence
```

## Responsive

- **Desktop (≥ 1024px):** fixed sidebar, one-row header, records in a table with the actions aligned on the right.
- **Tablet (768–1023px):** drawer menu, compact table (icon buttons).
- **Phone (< 768px):** drawer menu, one card per record (ID on top, label · value rows, actions at the bottom).
- The content of every screen is centered and never wider than 1280px (`CONTENT_MAX_WIDTH` in `src/layout.js`).
