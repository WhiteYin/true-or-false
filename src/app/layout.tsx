import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "真的假的.com · 别急着转发，先看看证据",
  description: "输入一条新闻、一段传言或原文链接，准备你想核实的内容。当前为首页体验版，核查服务尚未接通。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F6F0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
