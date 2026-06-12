import "./globals.css";
import Link from "next/link";
import { TransactionProvider } from "./providers";

export const metadata = {
  title: "Finance Dashboard",
  description: "Track income, expenses, categories, charts and exports."
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/categories", label: "Categories" },
  { href: "/export", label: "Export" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TransactionProvider>
          <div className="app-shell">
            <aside className="sidebar">
              <div className="brand">
                <span className="brand-mark">💼</span>
                <div>
                  <h1>Finance Hub</h1>
                  <p>Budget & analytics</p>
                </div>
              </div>

              <nav>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>

            <main className="page-content">{children}</main>
          </div>
        </TransactionProvider>
      </body>
    </html>
  );
}
