'use client';
import { useState } from 'react';
type CertificateData = { id: string; userName: string; worldName: string; title: string; platform: string; color: string; completedDate: string; issuedDate: string };
// Canvas uses browser fonts so full names, accents and non-Latin text are preserved.
export async function certificatePDF(data: CertificateData) {
  const { PDFDocument } = await import('pdf-lib');
  const canvas = document.createElement('canvas');
  canvas.width = 2382; canvas.height = 1684;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Seu navegador não disponibilizou o gerador de PDF. Use a opção de impressão.');
  await document.fonts.ready;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = data.color; ctx.lineWidth = 6; ctx.strokeRect(70, 70, 2242, 1544);
  ctx.fillStyle = data.color; ctx.fillRect(70, 70, 2242, 24);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const text = (value: string, y: number, size: number, color = '#202d32', bold = false) => {
    ctx.fillStyle = color; ctx.font = `${bold ? '700' : '400'} ${size}px Arial, sans-serif`;
    ctx.fillText(value, 1191, y, 2000);
  };
  text(data.platform + '.', 240, 64, data.color, true);
  text('CERTIFICADO DE CONCLUSÃO', 390, 30, data.color, true);
  text(data.title, 510, 76, '#202d32', true);
  text('Certificamos que', 670, 37);
  // Fit long names without truncating them.
  let size = 80;
  do { ctx.font = `700 ${size}px Arial, sans-serif`; if (ctx.measureText(data.userName).width <= 1980) break; size -= 2; } while (size > 24);
  text(data.userName, 800, size, '#202d32', true);
  text('concluiu integralmente o mundo', 930, 37);
  text(data.worldName, 1045, 64, data.color, true);
  text('em ' + data.completedDate + '.', 1155, 37);
  ctx.strokeStyle = '#bdccc4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(260, 1310); ctx.lineTo(2122, 1310); ctx.stroke();
  text('Emitido por ' + data.platform + ' em ' + data.issuedDate, 1390, 29);
  text('Código único: ' + data.id, 1465, 28);
  const pdf = await PDFDocument.create();
  pdf.setTitle(data.title); pdf.setAuthor(data.platform); pdf.setSubject('Certificado ' + data.id);
  const image = await pdf.embedPng(canvas.toDataURL('image/png'));
  const page = pdf.addPage([841.89, 595.28]);
  page.drawImage(image, { x: 0, y: 0, width: 841.89, height: 595.28 });
  return pdf.save();
}
export function DownloadCertificate({ data }: { data: CertificateData }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <><button className="primary-button" disabled={busy} onClick={async () => {
    setBusy(true); setError('');
    try {
      const bytes = await certificatePDF(data);
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }));
      const link = document.createElement('a'); link.href = url; link.download = 'politika-certificado-' + data.id + '.pdf';
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) { setError(error instanceof Error ? error.message : 'Não foi possível gerar o PDF. Use a opção de impressão.'); }
    finally { setBusy(false); }
  }}>{busy ? 'Gerando PDF…' : 'Baixar PDF'}</button>{error && <p role="alert">{error}</p>}</>;
}
