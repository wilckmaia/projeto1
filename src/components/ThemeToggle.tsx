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
  return <button type="button" className="theme-toggle" aria-label="Modo escuro" aria-pressed={dark} title={dark ? 'Ativar modo claro' : 'Ativar modo escuro'} onClick={toggle}>
    <span className="theme-light" aria-hidden="true">☀ <span>Claro</span></span>
    <span className="theme-dark" aria-hidden="true">☾ <span>Escuro</span></span>
  </button>;
}
