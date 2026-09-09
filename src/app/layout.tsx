import type { Metadata } from "next";
import "./globals.css";
import "./themes.css";
import { themeBootstrapScript } from '@/lib/theme';

export const metadata: Metadata = {
  title: "Politika | Aprenda política por camadas",
  description: "Uma trilha gamificada e apartidária para estudar política brasileira e ciência política.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} /></head><body>{children}</body></html>;
}
