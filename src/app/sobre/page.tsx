import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

const title = 'Sobre o Politika | Aprenda política por camadas';
const description = 'Conheça o Politika: uma trilha gamificada e apartidária para aprender sobre política brasileira e ciência política, com atividades e acompanhamento do progresso.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/sobre' },
  robots: { index: true, follow: true },
  openGraph: { title, description, url: '/sobre', siteName: 'Politika', locale: 'pt_BR', type: 'website' },
};

export default function AboutPage() {
  return <main className="auth-screen"><article className="auth-card" style={{ maxWidth: 760 }}>
    <header className="auth-header"><ThemeToggle /></header>
    <div className="eyebrow">Politika</div>
    <h1>Aprenda política por camadas</h1>
    <p>O Politika é uma trilha de aprendizagem gamificada e apartidária sobre política brasileira e ciência política. A proposta é construir conhecimento aos poucos, conectando conceitos a atividades que ajudam você a refletir sobre a vida em sociedade.</p>

    <section aria-labelledby="learning-title">
      <h2 id="learning-title">Uma trilha para construir conhecimento</h2>
      <p>O conteúdo é organizado em mundos e tarefas. Você começa pelos fundamentos e avança pelas etapas conforme conclui as atividades, explorando temas como democracia, instituições e participação política.</p>
    </section>

    <section aria-labelledby="practice-title">
      <h2 id="practice-title">Aprenda, pratique e acompanhe seu progresso</h2>
      <p>As tarefas trazem perguntas e explicações para apoiar o aprendizado. Na sua conta, você pode acompanhar as atividades concluídas e as conquistas, além de continuar a trilha quando voltar.</p>
    </section>

    <section aria-labelledby="perspective-title">
      <h2 id="perspective-title">Conhecimento para fazer perguntas melhores</h2>
      <p>Estudar política ajuda a compreender decisões coletivas e o funcionamento das instituições. O Politika propõe esse estudo de forma apartidária, incentivando a reflexão sobre os conceitos apresentados.</p>
    </section>

    <section aria-labelledby="start-title">
      <h2 id="start-title">Comece sua trilha</h2>
      <p>Crie uma conta ou entre para acessar as atividades e salvar seu progresso.</p>
      <Link href="/" className="primary-button" style={{ display: 'inline-block', textDecoration: 'none' }}>Entrar ou criar conta</Link>
    </section>
  </article></main>;
}
