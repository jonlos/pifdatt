import type { Metadata } from "next";
import { Barlow_Condensed, Teko } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const teko = Teko({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PIFDATT | WOLNOŚĆ FINANSOWA",
  description: "PIFDATT — the authority in free mixtapes. WOLNOŚĆ FINANSOWA od BIAŁAS I LANEK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${barlowCondensed.variable} ${teko.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
