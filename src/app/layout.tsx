import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Casamento Jeniffer & Rian | 12.12.2026",
  description: "Celebre conosco este momento especial. Confirmação de presença para 12 de Dezembro de 2026.",
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
    <html lang="pt-BR" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased bg-canvas-base text-content-primary selection:bg-accent-gold/20 selection:text-content-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
