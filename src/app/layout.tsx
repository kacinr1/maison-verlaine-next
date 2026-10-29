import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Configurateur Trois-Pièces | Maison Verlaine",
  description: "Personnalisez votre costume de luxe sur mesure avec notre configurateur 3D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${jost.variable} h-screen`}
    >
      <body className="h-screen overflow-hidden bg-[#0b0f17]">{children}</body>
    </html>
  );
}
