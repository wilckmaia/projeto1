'use client';
export function PrintCertificate() {
  return <button className="secondary-button" onClick={() => window.print()}>Imprimir / Salvar como PDF</button>;
}
