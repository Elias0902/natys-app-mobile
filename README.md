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

`src/utils/config.js`:

- `USE_MOCK = true` runs the app on sample data (no backend needed).
- To use the real system set `USE_MOCK = false` and `BASE_URL` to your server (e.g. `http://192.168.1.50/natys-larence`).
- Copy every file of `php/` into `natys-larence/api/`.

## Structure

```
index.js, App.js   entry points
assets/            images
src/api/           exchange rates
src/components/    shared components (Header, Sidebar, Drawer, Page, Icon, SearchBar...)
src/features/      one folder per feature, each with components/, screens/ and services/
  auth/            login, sign up, password recovery
  ecommerce/       catalog, cart and orders
  miperfil/        user profile
  modulos/         generic list and CRUD for the modules of the menu (forms in fields.js)
src/screens/       global pages (Info, NotFound)
src/navigation/    AppNavigator (session, cart, current screen) and the menu
src/utils/         config, http, theme, layout, format, mock data
php/               endpoints to add to natys-larence
```

## Responsive

- **Desktop (≥ 1024px):** fixed sidebar, one-row header, records in a table with the actions aligned on the right.
- **Tablet (768–1023px):** drawer menu, compact table (icon buttons).
- **Phone (< 768px):** drawer menu, one card per record (ID on top, label · value rows, actions at the bottom).
- The content of every screen is centered and never wider than 1280px (`CONTENT_MAX_WIDTH` in `src/layout.js`).
