import { headers } from 'next/headers';
import type { Metadata } from "next";
import "./globals.css";
import "./themes.css";
import { themeBootstrapScript } from '@/lib/theme';

export const metadata: Metadata = {
  title: "Politika | Aprenda política por camadas",
  description: "Uma trilha gamificada e apartidária para estudar política brasileira e ciência política.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return <html lang="pt-BR" suppressHydrationWarning><head><script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} /></head><body>{children}</body></html>;
}
