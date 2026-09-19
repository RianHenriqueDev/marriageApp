import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Casamento Jeniffer & Rian | 12.12.2026",
  description: "Celebre conosco este momento inesquecível. Confirme sua presença para 12 de Dezembro de 2026.",
  openGraph: {
    title: "Casamento Jeniffer & Rian | 12.12.2026",
    description: "Você foi convidado para celebrar o nosso amor!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable} ${pixelFont.variable}`}>
      <body className="font-sans antialiased selection:bg-gold-200 selection:text-emeraldDeep">
        {children}
      </body>
    </html>
  );
}
