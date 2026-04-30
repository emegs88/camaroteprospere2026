import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Camarote Prospere | Festa do Peão Hortolândia 2026",
  description: "Sistema de gerenciamento de camarotes e convites digitais - Festa do Peão de Hortolândia 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased font-barlow bg-[#1a1a1a] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
