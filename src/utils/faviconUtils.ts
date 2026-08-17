/**
 * Favicon & Logo Utilities
 */

// Cheerful pastel neo-brutalist backgrounds
export const ICON_PASTEL_COLORS = [
  '#EEF2FF', // Pastel Indigo
  '#FEE2E2', // Pastel Coral/Red
  '#ECFDF5', // Pastel Emerald
  '#FEF3C7', // Pastel Amber
  '#F3E8FF', // Pastel Purple
  '#E0F2FE', // Pastel Sky
  '#FCE7F3', // Pastel Pink
  '#FEF9C3', // Pastel Yellow
  '#E2E8F0', // Pastel Slate
];

export function getFaviconUrl(url: string, domain: string): string {
  // Use Google's reliable S2 128px high-resolution Favicon CDN
  const cleanDomain = (domain || '').replace(/^https?:\/\//, '').split('/')[0];
  if (cleanDomain) {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=128`;
  }
  const target = url || `https://${domain}`;
  return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAV_ICON&sub_type=ICON&url=${encodeURIComponent(target)}&size=128`;
}

export function getDuckDuckGoFaviconUrl(domain: string): string {
  const cleanDomain = (domain || '').replace(/^https?:\/\//, '').split('/')[0];
  return `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;
}

export function getIconHorseUrl(domain: string): string {
  const cleanDomain = (domain || '').replace(/^https?:\/\//, '').split('/')[0];
  return `https://icon.horse/icon/${cleanDomain}`;
}

export function getUnavatarUrl(domain: string): string {
  const cleanDomain = (domain || '').replace(/^https?:\/\//, '').split('/')[0];
  return `https://unavatar.io/${cleanDomain}`;
}

export function getInitialColor(str: string): string {
  if (!str) return ICON_PASTEL_COLORS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ICON_PASTEL_COLORS.length;
  return ICON_PASTEL_COLORS[index];
}

export function getInitials(name: string, domain: string): string {
  if (!name && !domain) return '★';
  const target = name || domain;
  const words = target.trim().split(/[\s.-]+/);
  if (words.length >= 2 && words[0] && words[1]) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return target.slice(0, 2).toUpperCase();
}
