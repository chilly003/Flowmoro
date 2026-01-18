import type { Metadata } from "next";
import { Geist, Geist_Mono, Jua } from "next/font/google";
import SessionProviders from "@/components/auth/SessionProviders";
import { QueryProvider } from "@/components/layout/QueryProvider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const jua = Jua({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Flowmoro',
    default: 'Flowmoro - 할일 체크 뽀모도로',
  },
  description: "집중력을 높여주는 일정 관리 및 뽀모도로 타이머 서비스",
  openGraph: {
    title: 'Flowmoro',
    description: "집중력을 높여주는 일정 관리 및 뽀모도로 타이머",
    url: 'https://flowmoro.com',
    siteName: 'Flowmoro',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'msapplication-TileImage', url: '/ms-icon-70x70.png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} ${jua.className} antialiased bg-blues-100`}>
        <SessionProviders>
          <QueryProvider>{children}</QueryProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
