import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a1a",
};

export const metadata: Metadata = {
  title: "2026 나의 키워드 3개 | 올해를 정의할 키워드는?",
  description:
    "AI가 분석한 2026년 나만의 키워드 3개를 확인하세요. 이름과 생년월일로 알아보는 나의 2026년 운세 키워드!",
  keywords: ["2026 키워드", "운세", "AI 운세", "나의 키워드", "2026년 운세", "키워드 테스트"],
  openGraph: {
    title: "🔮 2026 나의 키워드 3개",
    description: "AI가 분석한 2026년 나만의 키워드를 확인해보세요! 이름과 생년월일만 입력하면 끝!",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "🔮 2026 나의 키워드 3개",
    description: "AI가 분석한 2026년 나만의 키워드를 확인해보세요!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased min-h-screen bg-mystic-900">
        {children}
      </body>
    </html>
  );
}
