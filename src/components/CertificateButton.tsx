'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function CertificateButton({ worldId }: { worldId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  return <><button className="primary-button" disabled={busy} onClick={async () => {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/certificates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ worldId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Falha ao emitir certificado.');
      router.push(data.path); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : 'Falha de conexão.'); }
    finally { setBusy(false); }
  }}>{busy ? 'Emitindo…' : 'Emitir certificado'}</button>{error && <p role="alert">{error}</p>}</>;
}
