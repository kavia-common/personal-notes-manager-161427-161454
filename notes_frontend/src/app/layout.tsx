import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notes - Personal Notes Manager",
  description: "Create, edit, and manage your personal notes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr]">
          <aside className="sidebar p-4">
            <div className="flex items-center gap-2 mb-6">
              <div
                style={{ backgroundColor: "var(--color-primary)" }}
                className="w-3 h-6 rounded-sm"
              />
              <h1 className="text-lg font-semibold" aria-label="App name">
                Notes
              </h1>
            </div>

            <nav className="flex flex-col gap-2">
              <Link href="/" className="card p-3 hover:shadow-sm transition">
                All Notes
              </Link>
              <Link href="/auth" className="card p-3 hover:shadow-sm transition">
                Sign In / Up
              </Link>
            </nav>

            <div className="mt-8 text-sm text-slate-500">
              <div className="badge">Light • Minimal</div>
              <p className="mt-2">
                Organize your thoughts with a clean, distraction-free UI.
              </p>
            </div>

            <footer className="mt-10 text-xs text-slate-400">
              <p>v1.0</p>
            </footer>
          </aside>

          <main className="p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
