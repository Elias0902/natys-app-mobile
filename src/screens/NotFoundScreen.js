import InfoScreen from './InfoScreen';

// Global 404: shown when the navigator receives a screen it does not know
export default function NotFoundScreen() {
  return <InfoScreen title="Página no encontrada" text="Esta sección no existe. Elige otra opción del menú." />;
}
