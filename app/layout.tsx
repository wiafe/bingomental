import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bingo Mental",
  description: "A mental bingo game with progression mechanics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
