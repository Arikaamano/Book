/**
 * URL Utilities for Bookmark Launcher
 */

export function isValidUrl(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim();
  
  // Quick test or attempt to construct URL
  try {
    const url = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function formatUrlForInput(input: string): string {
  let trimmed = input.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

export function extractDomain(input: string): string {
  try {
    const formatted = formatUrlForInput(input);
    const url = new URL(formatted);
    return url.hostname.replace(/^www\./, '');
  } catch {
    // Fallback extraction
    const clean = input.replace(/^https?:\/\//, '').split('/')[0].split('?')[0];
    return clean.replace(/^www\./, '') || input;
  }
}

export function normalizeUrl(input: string): string {
  try {
    const formatted = formatUrlForInput(input);
    const url = new URL(formatted);
    // Lowercase hostname and remove trailing slash from path
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    let pathname = url.pathname;
    if (pathname.endsWith('/') && pathname.length > 1) {
      pathname = pathname.slice(0, -1);
    }
    if (pathname === '/') {
      pathname = '';
    }
    return `${url.protocol}//${hostname}${pathname}${url.search}`;
  } catch {
    return input.trim().toLowerCase().replace(/\/+$/, '');
  }
}

export function areUrlsEqual(url1: string, url2: string): boolean {
  return normalizeUrl(url1) === normalizeUrl(url2);
}

export function deriveTitleFromDomain(domain: string): string {
  const parts = domain.split('.');
  if (parts.length > 0) {
    const main = parts[0];
    return main.charAt(0).toUpperCase() + main.slice(1);
  }
  return domain;
}
