'use client';
import { useState } from 'react';
export function ShareAchievement({ worldId, initialPath }: { worldId: string; initialPath?: string }) {
  const [url, setUrl] = useState(initialPath ?? '');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function mutate(revoke: boolean) {
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/achievements/share', { method: revoke ? 'DELETE' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ worldId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Não foi possível concluir.');
      if (revoke) { setUrl(''); setMessage('Link revogado. Ele não pode mais ser acessado.'); return; }
      const publicUrl = new URL(data.path, window.location.origin).href;
      setUrl(publicUrl);
      try { await navigator.clipboard.writeText(publicUrl); setMessage('Link copiado! Compartilhe sua conquista.'); }
      catch { setMessage('Seu link está pronto. Selecione e copie abaixo.'); }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Tente novamente.'); }
    finally { setBusy(false); }
  }
  return <div className="achievement-share">
    <button className="primary-button" type="button" disabled={busy} onClick={() => mutate(false)}>{busy ? 'Preparando…' : 'Compartilhar conquista ↗'}</button>
    <small>Ao compartilhar, seu nome e esta conquista ficam públicos.</small>
    {url && <><input aria-label="Link público da conquista" readOnly value={url} onFocus={event => event.target.select()} />
      <a href={url} target="_blank" rel="noreferrer">Ver página pública ↗</a>
      <button className="secondary-button" disabled={busy} onClick={() => mutate(true)}>Revogar link</button></>}
    <p role="status">{message}</p>
  </div>;
}
