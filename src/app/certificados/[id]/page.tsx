import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/storage';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DownloadCertificate } from '@/components/DownloadCertificate';
import { PrintCertificate } from '@/components/PrintCertificate';
export const metadata = { title: 'Certificado de conclusão | Politika', robots: { index: false, follow: false } };
export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/');
  const certificate = await prisma.certificate.findFirst({ where: { id, userId: user.id } });
  if (!certificate) notFound();
  return <main className="certificate-page"><header className="task-header certificate-actions"><Link className="back-button" href="/perfil">← Meus certificados</Link><ThemeToggle/></header>
    <article className="certificate-document" style={{ '--certificate-color': certificate.color } as React.CSSProperties}>
      <div className="certificate-brand">{certificate.platform}<span>.</span></div><div className="eyebrow">Certificado de conclusão</div><h1>{certificate.title}</h1><p>Certificamos que</p><h2>{certificate.userName}</h2><p>concluiu integralmente o mundo</p><h3>{certificate.worldName}</h3><p>em {certificate.completedAt.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.</p>
      <footer><p>Emitido por {certificate.platform} em {certificate.issuedAt.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p><small>Código único: {certificate.id}</small></footer>
    </article><div className="certificate-actions action-row"><DownloadCertificate data={{ ...certificate, completedDate: certificate.completedAt.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }), issuedDate: certificate.issuedAt.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) }}/><PrintCertificate/></div>
  </main>;
}
