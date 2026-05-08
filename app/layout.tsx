import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '缺血性脑卒中中医智能证据构建系统 · V1.0',
  description: '中医循证证据链构建系统 V1.0 前端',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
