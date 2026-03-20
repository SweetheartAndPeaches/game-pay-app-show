import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "9INR - डाउनलोड करें",
  description: "9INR - भारत का सबसे लोकप्रिय मनोरंजन ऐप। तीन स्तरीय कमीशन प्रणाली के साथ पासिव इनकम कमाएं!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
