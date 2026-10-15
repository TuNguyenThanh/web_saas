import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nimbus — Ship your SaaS faster",
    template: "%s · Nimbus",
  },
  description:
    "A Next.js + TypeScript + Tailwind SaaS starter with auth, protected dashboard, and API routes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning: some browser extensions (e.g. Grammarly)
          inject attributes onto <body> before React hydrates, which would
          otherwise trigger a hydration mismatch warning. */}
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
