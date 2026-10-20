// Backend is not connected yet: with USE_MOCK = true the app runs on sample data.
// When the backend is ready: set USE_MOCK = false and put your PC's LAN IP in BASE_URL.
export const USE_MOCK = true;
export const BASE_URL = 'http://192.168.1.50/natys-larence';
// Public landing of the system (opened from the login screen).
export const LANDING_URL = `${BASE_URL}/index.php?url=landing`;
