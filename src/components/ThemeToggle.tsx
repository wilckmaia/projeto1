'use client';

import { useSyncExternalStore } from 'react';
import { THEME_KEY } from '@/lib/theme';

const changeEvent = 'politika-theme-change';
const getTheme = () => document.documentElement.dataset.theme === 'dark';
const getServerTheme = () => false;

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.storageArea !== window.localStorage) return;
    if (event.key !== THEME_KEY && event.key !== null) return;
    document.documentElement.dataset.theme = event.newValue === 'dark' ? 'dark' : 'light';
    onChange();
  };
  window.addEventListener(changeEvent, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const toggle = () => {
    const theme = getTheme() ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* Session-only fallback. */ }
    window.dispatchEvent(new Event(changeEvent));
  };
  return <button type="button" className="theme-toggle" aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"} aria-pressed={dark} title={dark ? 'Ativar modo claro' : 'Ativar modo escuro'} onClick={toggle}>
    <span className="theme-light" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg><span>Tema claro</span></span>
    <span className="theme-dark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/></svg><span>Tema escuro</span></span>
  </button>;
}
