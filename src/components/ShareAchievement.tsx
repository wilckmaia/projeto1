'use client';

import { useState } from 'react';

export function ShareAchievement({ worldId }: { worldId: string }) {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function share() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/achievements/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ worldId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Não foi possível criar o link.');
      const publicUrl = new URL(data.path, window.location.origin).href;
      setUrl(publicUrl);
      try {
        await navigator.clipboard.writeText(publicUrl);
        setMessage('Link copiado! Compartilhe sua conquista.');
      } catch { setMessage('Seu link está pronto. Selecione e copie abaixo.'); }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Tente novamente.'); }
    finally { setBusy(false); }
  }
  return <div className="achievement-share">
    <button className="primary-button" type="button" disabled={busy} onClick={share}>{busy ? 'Preparando…' : 'Compartilhar conquista ↗'}</button>
    <small>Ao compartilhar, seu nome e esta conquista ficam públicos.</small>
    {url && <><input aria-label="Link público da conquista" readOnly value={url} onFocus={(event) => event.target.select()} /><a href={url} target="_blank" rel="noreferrer">Ver página pública ↗</a></>}
    <p role="status">{message}</p>
  </div>;
}
