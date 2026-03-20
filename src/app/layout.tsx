import type { Metadata } from "next";
import { Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-sans-devanagari",
});

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
    <html lang="hi" className={notoSansDevanagari.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
