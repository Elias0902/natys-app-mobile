import { createContext, useContext } from 'react';
import { useWindowDimensions } from 'react-native';

// Screen sizes used by the whole app
//   phone   < 768px  -> drawer menu, records shown as cards
//   tablet  768-1023 -> drawer menu, compact table
//   desktop >= 1024  -> fixed sidebar like the web system, full table
export const BREAKPOINTS = { tablet: 768, desktop: 1024 };
export const SIDEBAR_WIDTH = 240;
// The content never gets wider than this (it stays centered on big monitors)
export const CONTENT_MAX_WIDTH = 1280;

export function computeLayout(width, sidebarVisible = true) {
  const isPhone = width < BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.desktop;
  const gutter = isPhone ? 12 : 24;
  const sidebar = isDesktop && sidebarVisible ? SIDEBAR_WIDTH : 0;
  // Width available for the content of a screen (without the side padding)
  const contentWidth = Math.min(CONTENT_MAX_WIDTH, width - sidebar) - gutter * 2;
  return { width, isPhone, isTablet: !isPhone && !isDesktop, isDesktop, gutter, contentWidth };
}

// App.js provides the layout (it knows if the sidebar is open); screens read it with useLayout()
export const LayoutContext = createContext(null);

export function useLayout() {
  const layout = useContext(LayoutContext);
  const { width } = useWindowDimensions();
  return layout || computeLayout(width);
}
