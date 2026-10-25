import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Casamento Jeniffer & Rian | 12.12.2026",
  description: "Celebre conosco este momento especial. Convite oficial e confirmação de presença para 12 de Dezembro de 2026.",
  openGraph: {
    title: "Casamento Jeniffer & Rian | 12.12.2026",
    description: "Você é nosso convidado especial para celebrar este momento único.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased bg-[#F8F6F0] text-[#1A1A19] selection:bg-[#C5A880]/25 selection:text-[#2C3328] min-h-screen">
        {children}
      </body>
    </html>
  );
}
