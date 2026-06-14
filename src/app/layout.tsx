import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "قوست كيز | Ghost Keys",
  description: "أفضل متجر لبيع أكواد ألعاب البي سي بأرخص الأسعار",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}