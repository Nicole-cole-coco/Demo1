import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: {
    default: "人格宇宙 Persona Universe",
    template: "%s | 人格宇宙"
  },
  description: "认识不同人格角色，在日常交流和关系情景中理解沟通方式，获得基于互动的关系洞察。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
