import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Instant UI", template: "%s · Instant UI" },
  description: "Demos of techniques for building instant, high-performance web UIs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
