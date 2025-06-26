import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "Justax.Space - AI Language Learning Universe",
  description: "Your personal AI tutor for mastering any language, from any language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}