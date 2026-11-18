// The visual theme is picked at build time with PUBLIC_THEME (garden | fair | marquee).
// Each Amplify demo app sets a different value; layouts and content are shared.

export const THEMES = {
  garden: {
    label: 'Garden Party',
    fonts:
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap',
  },
  fair: {
    label: 'Summer Fair',
    fonts:
      'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap',
  },
  marquee: {
    label: 'Vintage Marquee',
    fonts:
      'https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap',
  },
} as const;

export type ThemeName = keyof typeof THEMES;

const raw = (import.meta.env.PUBLIC_THEME ?? 'garden') as string;
export const themeName: ThemeName = raw in THEMES ? (raw as ThemeName) : 'garden';
export const theme = THEMES[themeName];
